const Event = require("../models/events");
const User = require("../models/users");

// =======================
// CREATE EVENT (Host only)
// =======================
const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).json({ success: false, message: "Only hosts can create events" });
    }

    const { title, description, date, venue, type, budget, ticket_price } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: "Title and date are required" });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const newEvent = new Event({
      title,
      description,
      date: eventDate,
      venue: venue || "",
      type: type || "general",
      budget: budget || 0,
      ticket_price: ticket_price || 0,
      status: "draft",
      createdBy: req.user.id,
    });

    await newEvent.save();

    res.status(201).json({ success: true, message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// GET ALL EVENTS (public — confirmed only for guests)
// =======================
const getEvents = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "guest") {
      query.status = { $in: ["confirmed", "completed"] };
    }
    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// GET SINGLE EVENT
// =======================
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email").populate("attendees", "name email");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// GET MY EVENTS
// =======================
const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let events;

    if (role === "host") {
      events = await Event.find({ createdBy: userId }).populate("attendees", "name email").sort({ date: 1 });
    } else {
      events = await Event.find({ attendees: userId }).populate("createdBy", "name").sort({ date: 1 });
    }

    const now = new Date();
    const upcoming = [];
    const past = [];
    const draft = [];

    events.forEach((event) => {
      if (event.status === "draft") {
        draft.push(event);
      } else if (new Date(event.date) > now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    const stats = {
      total: events.length,
      upcoming: upcoming.length,
      past: past.length,
      draft: draft.length,
    };

    res.json({ role, events: { upcoming, past, draft }, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// UPDATE EVENT (Host only, own events)
// =======================
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, venue, type, status, budget, ticket_price, progress } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized: you can only edit your own events" });
    }

    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (venue !== undefined) event.venue = venue;
    if (type) event.type = type;
    if (status) event.status = status;
    if (budget !== undefined) event.budget = budget;
    if (ticket_price !== undefined) event.ticket_price = ticket_price;
    if (progress !== undefined) event.progress = Math.min(100, Math.max(0, progress));

    if (date) {
      const newDate = new Date(date);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date format" });
      }
      event.date = newDate;
    }

    await event.save();
    res.status(200).json({ success: true, message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// DELETE EVENT (Host only, own events)
// =======================
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized: you can only delete your own events" });
    }

    await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// REGISTER FOR EVENT (Guest only)
// =======================
const registerForEvent = async (req, res) => {
  try {
    if (req.user.role !== "guest") {
      return res.status(403).json({ success: false, message: "Only guests can register for events" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (!["confirmed"].includes(event.status)) {
      return res.status(400).json({ success: false, message: "This event is not open for registration" });
    }

    const alreadyRegistered = event.attendees.some((a) => a.toString() === req.user.id);
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: "You are already registered for this event" });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.status(200).json({ success: true, message: "Successfully registered for the event", event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// UNREGISTER FROM EVENT (Guest only)
// =======================
const unregisterFromEvent = async (req, res) => {
  try {
    if (req.user.role !== "guest") {
      return res.status(403).json({ success: false, message: "Only guests can unregister from events" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    const idx = event.attendees.findIndex((a) => a.toString() === req.user.id);
    if (idx === -1) {
      return res.status(400).json({ success: false, message: "You are not registered for this event" });
    }

    event.attendees.splice(idx, 1);
    await event.save();

    res.status(200).json({ success: true, message: "Successfully unregistered from the event" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createEvent, getEvents, getEventById, getMyEvents, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent };
