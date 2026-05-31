import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

// ─── Create/Edit Event Modal ────────────────────────────────────────────────
function EventFormModal({ event, onClose, onSave }) {
  const isEdit = !!event;
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date ? new Date(event.date).toISOString().slice(0, 10) : "",
    venue: event?.venue || "",
    type: event?.type || "general",
    status: event?.status || "draft",
    budget: event?.budget || 0,
    ticket_price: event?.ticket_price || 0,
    progress: event?.progress || 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { toast.error("Title and date are required"); return; }
    setSubmitting(true);
    try {
      if (isEdit) {
        await API.put(`/events/${event._id}`, form);
        toast.success("Event updated successfully! ✅");
      } else {
        await API.post("/events", form);
        toast.success("Event created successfully! 🎉");
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const eventTypes = ["general", "wedding", "corporate", "music", "conference", "sports", "community"];
  const statusOptions = isEdit ? ["draft", "confirmed", "completed", "cancelled"] : ["draft"];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-500/30 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-bold text-lg">{isEdit ? "✏️ Edit Event" : "🎯 Create New Event"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Event Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all"
              placeholder="Enter event title" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all resize-none"
              placeholder="Describe your event..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Date *</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} required
                min={isEdit ? undefined : new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Venue</label>
              <input name="venue" value={form.venue} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all"
                placeholder="Venue / Location" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Event Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-all">
                {eventTypes.map(t => <option key={t} value={t} className="bg-gray-900 capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-all">
                {statusOptions.map(s => <option key={s} value={s} className="bg-gray-900 capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Budget (₹)</label>
              <input name="budget" type="number" min="0" value={form.budget} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-all"
                placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Ticket Price (₹)</label>
              <input name="ticket_price" type="number" min="0" value={form.ticket_price} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-all"
                placeholder="0 = Free" />
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Planning Progress ({form.progress}%)</label>
              <input name="progress" type="range" min="0" max="100" value={form.progress} onChange={handleChange}
                className="w-full accent-red-500" />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-700/50 text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting}
              className={`flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-500 hover:to-red-600 transition-all ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{isEdit ? "Saving..." : "Creating..."}</span>
              ) : (isEdit ? "Save Changes" : "Create Event")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Event Detail Modal ──────────────────────────────────────────────────────
function EventDetailModal({ event, onClose, onEdit, onDelete }) {
  if (!event) return null;
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  const statusColors = { confirmed: "text-green-400", completed: "text-blue-400", cancelled: "text-red-400", draft: "text-yellow-400" };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-500/30 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-white font-bold text-lg leading-tight flex-1 mr-3">{event.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {event.description && <p className="text-gray-300 text-sm mb-4 leading-relaxed">{event.description}</p>}

        <div className="space-y-2 text-sm border-t border-gray-700 pt-4">
          {[
            { label: "Date", value: formatDate(event.date) },
            { label: "Venue", value: event.venue || "—" },
            { label: "Type", value: event.type || "General" },
            { label: "Status", value: event.status, className: statusColors[event.status] },
            { label: "Attendees", value: `${event.attendees?.length || 0}` },
            { label: "Budget", value: event.budget ? `₹${event.budget}` : "—" },
            { label: "Ticket Price", value: event.ticket_price > 0 ? `₹${event.ticket_price}` : "Free" },
          ].map(({ label, value, className }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}:</span>
              <span className={`text-gray-300 capitalize ${className || ""}`}>{value}</span>
            </div>
          ))}
        </div>

        {event.status !== "completed" && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Planning Progress</span><span>{event.progress || 0}%</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500" style={{ width: `${event.progress || 0}%` }}></div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-5">
          <button onClick={() => { onEdit(event); onClose(); }} className="flex-1 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-xl text-sm font-semibold hover:bg-blue-600/30 transition-colors">✏️ Edit</button>
          <button onClick={() => { onDelete(event._id); onClose(); }} className="flex-1 py-2 bg-red-600/20 text-red-300 border border-red-500/30 rounded-xl text-sm font-semibold hover:bg-red-600/30 transition-colors">🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Attendees Modal (for hosts) ─────────────────────────────────────────────
function AttendeesModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-purple-500/30 max-w-sm w-full shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-base">Attendees — {event.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        {event.attendees?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No attendees yet</p>
        ) : (
          <ul className="space-y-2">
            {event.attendees.map((a, i) => (
              <li key={a._id || i} className="flex items-center gap-3 p-2 bg-black/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{a.name?.charAt(0) || "?"}</div>
                <div>
                  <p className="text-white text-xs font-medium">{a.name || "Unknown"}</p>
                  <p className="text-gray-400 text-xs">{a.email || ""}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Event Card ──────────────────────────────────────────────────────────────
function HostEventCard({ event, onView, onEdit, onDelete, onViewAttendees }) {
  const statusColors = { confirmed: "text-green-400 bg-green-500/20 border-green-500/30", completed: "text-blue-400 bg-blue-500/20 border-blue-500/30", cancelled: "text-red-400 bg-red-500/20 border-red-500/30", draft: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30" };
  const typeIcons = { conference: "🎤", wedding: "💍", corporate: "🏢", community: "🤝", music: "🎵", sports: "⚽", general: "🎉" };
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{typeIcons[event.type] || "🎉"}</span>
          <h3 className="text-white font-bold text-sm truncate">{event.title}</h3>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs border flex-shrink-0 ml-2 ${statusColors[event.status]}`}>{event.status}</span>
      </div>

      <div className="space-y-1.5 mb-3 flex-grow">
        <div className="flex items-center space-x-2 text-xs text-gray-300"><span>📅</span><span>{formatDate(event.date)}</span></div>
        {event.venue && <div className="flex items-center space-x-2 text-xs text-gray-300"><span>📍</span><span className="truncate">{event.venue}</span></div>}
        <div className="flex items-center space-x-2 text-xs text-gray-300"><span>👥</span><span>{event.attendees?.length || 0} attendees</span></div>
        {event.budget > 0 && <div className="flex items-center space-x-2 text-xs text-gray-300"><span>💰</span><span>Budget: ₹{event.budget}</span></div>}
      </div>

      {event.status !== "completed" && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{event.progress || 0}%</span></div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full" style={{ width: `${event.progress || 0}%` }}></div>
          </div>
        </div>
      )}

      <div className="flex gap-1.5 mt-auto flex-wrap">
        <button onClick={() => onView(event)} className="flex-1 py-1.5 bg-red-500/20 text-red-300 rounded text-xs font-medium hover:bg-red-500/30 transition-colors border border-red-500/30 min-w-0">Details</button>
        <button onClick={() => onEdit(event)} className="flex-1 py-1.5 bg-blue-500/20 text-blue-300 rounded text-xs font-medium hover:bg-blue-500/30 transition-colors border border-blue-500/30 min-w-0">Edit</button>
        <button onClick={() => onViewAttendees(event)} className="flex-1 py-1.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium hover:bg-purple-500/30 transition-colors border border-purple-500/30 min-w-0">Guests</button>
        <button onClick={() => onDelete(event._id)} className="py-1.5 px-2 bg-gray-600/30 text-gray-300 rounded text-xs hover:bg-red-600/30 hover:text-red-300 transition-colors border border-gray-500/30">🗑️</button>
      </div>
    </div>
  );
}

function GuestEventCard({ event, onView }) {
  const typeIcons = { conference: "🎤", wedding: "💍", corporate: "🏢", community: "🤝", music: "🎵", sports: "⚽", general: "🎉" };
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  const isPast = new Date(event.date) < new Date();

  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{typeIcons[event.type] || "🎉"}</span>
          <h3 className="text-white font-bold text-sm truncate">{event.title}</h3>
        </div>
        {isPast ? <span className="text-xs text-blue-400 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">Past</span>
          : <span className="text-xs text-green-400 bg-green-500/20 border border-green-500/30 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">Registered</span>}
      </div>

      <div className="space-y-1.5 mb-3 flex-grow">
        <div className="flex items-center space-x-2 text-xs text-gray-300"><span>📅</span><span>{formatDate(event.date)}</span></div>
        {event.venue && <div className="flex items-center space-x-2 text-xs text-gray-300"><span>📍</span><span className="truncate">{event.venue}</span></div>}
        {event.createdBy?.name && <div className="flex items-center space-x-2 text-xs text-gray-300"><span>🎯</span><span>by {event.createdBy.name}</span></div>}
        {event.ticket_price > 0 && <div className="flex items-center space-x-2 text-xs text-gray-300"><span>💰</span><span>₹{event.ticket_price}</span></div>}
      </div>

      <button onClick={() => onView(event)} className="w-full py-1.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium hover:bg-purple-500/30 transition-colors border border-purple-500/30 mt-auto">View Details</button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MyEvents() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState({ upcoming: [], past: [], draft: [] });
  const [role, setRole] = useState(null);
  const [stats, setStats] = useState({ upcoming: 0, past: 0, draft: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [attendeesEvent, setAttendeesEvent] = useState(null);

  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get("/events/my-events");
      setEvents(res.data.events);
      setRole(res.data.role);
      setStats(res.data.stats);
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Please login to view your events");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        toast.error("Failed to load events");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyEvents(); }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    try {
      await API.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully");
      fetchMyEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: events.upcoming?.length || 0 },
    { id: "past", label: "Past", count: events.past?.length || 0 },
    ...(role === "host" ? [{ id: "draft", label: "Drafts", count: events.draft?.length || 0 }] : []),
  ];

  const currentEvents = events[activeTab] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-red-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-28 left-1/4 w-80 h-80 bg-purple-500/6 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Hero */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black leading-tight">
              My <span className="text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text">Events</span>
            </h1>
            {role && <p className="text-gray-400 text-sm mt-1">Logged in as: <span className="text-white font-semibold capitalize">{role}</span></p>}
          </div>
          {role === "host" && (
            <button onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-sm hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-900/20 flex items-center gap-2">
              <span>+</span> Create New Event
            </button>
          )}
          {role === "guest" && (
            <Link to="/events" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:scale-105">
              Browse Events →
            </Link>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "📅", title: "Upcoming", value: stats.upcoming, color: "from-green-500/15 to-green-600/10", border: "border-green-500/25" },
            { icon: "✅", title: role === "host" ? "Completed" : "Attended", value: stats.past, color: "from-blue-500/15 to-blue-600/10", border: "border-blue-500/25" },
            ...(role === "host" ? [
              { icon: "⏳", title: "Drafts", value: stats.draft, color: "from-yellow-500/15 to-yellow-600/10", border: "border-yellow-500/25" },
              { icon: "📊", title: "Total", value: stats.total, color: "from-purple-500/15 to-purple-600/10", border: "border-purple-500/25" },
            ] : [])
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 border ${stat.border} hover:scale-105 transition-all duration-300 cursor-pointer`}>
              <div className="text-lg mb-1">{stat.icon}</div>
              <p className="text-white font-bold text-xs mb-0.5">{stat.title}</p>
              <p className="text-red-300 font-bold text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs + Events */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto">
          {/* Tab navigation */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-xl p-1 border border-red-500/20 mb-5 flex">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${activeTab === tab.id ? "bg-red-500/20 text-white border border-red-500/30" : "text-gray-400 hover:text-white hover:bg-red-500/10"}`}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Events grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-black/40 rounded-xl h-52 animate-pulse border border-red-500/10"></div>)}
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-10 border border-red-500/20 text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-white font-bold text-sm mb-2">No {activeTab} events</h3>
              <p className="text-gray-400 text-xs mb-5">
                {activeTab === "upcoming" ? "You don't have any upcoming events." : activeTab === "past" ? role === "host" ? "Your past events will appear here." : "Events you've attended will appear here." : "Events you're planning will appear here."}
              </p>
              {role === "host" ? (
                <button onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-sm hover:from-red-500 hover:to-red-600 transition-all">
                  Create Your First Event
                </button>
              ) : (
                <Link to="/events" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-blue-500 transition-all inline-block">
                  Browse Events
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentEvents.map((event) => (
                role === "host" ? (
                  <HostEventCard key={event._id} event={event}
                    onView={setViewingEvent}
                    onEdit={(e) => setEditingEvent(e)}
                    onDelete={handleDelete}
                    onViewAttendees={setAttendeesEvent} />
                ) : (
                  <GuestEventCard key={event._id} event={event} onView={setViewingEvent} />
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {showCreateModal && (
        <EventFormModal onClose={() => setShowCreateModal(false)} onSave={fetchMyEvents} />
      )}
      {editingEvent && (
        <EventFormModal event={editingEvent} onClose={() => setEditingEvent(null)} onSave={fetchMyEvents} />
      )}
      {viewingEvent && (
        <EventDetailModal event={viewingEvent} onClose={() => setViewingEvent(null)}
          onEdit={(e) => { setViewingEvent(null); setEditingEvent(e); }}
          onDelete={(id) => { setViewingEvent(null); handleDelete(id); }} />
      )}
      {attendeesEvent && (
        <AttendeesModal event={attendeesEvent} onClose={() => setAttendeesEvent(null)} />
      )}

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}
