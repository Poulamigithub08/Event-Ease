import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useUser } from "../providers/UserContext";

const eventCategories = [
  { id: "all", name: "All Events", icon: "🎪" },
  { id: "wedding", name: "Weddings & Parties", icon: "💒" },
  { id: "corporate", name: "Corporate Events", icon: "💼" },
  { id: "music", name: "Music & Entertainment", icon: "🎵" },
  { id: "conference", name: "Conferences", icon: "🎤" },
  { id: "sports", name: "Sports & Fitness", icon: "⚽" },
  { id: "community", name: "Community & Charity", icon: "🤝" },
  { id: "general", name: "General", icon: "🎉" },
];

const typeIconMap = { wedding: "💒", corporate: "💼", music: "🎵", conference: "🎤", sports: "⚽", community: "🤝", general: "🎉" };

function EventCard({ event, user, onRegister, onUnregister, onViewDetails }) {
  const isRegistered = user && event.attendees?.some(a => (a._id || a) === user.id);
  const isPast = new Date(event.date) < new Date();

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-xl border border-purple-500/20 hover:border-purple-500/40 group transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-purple-900/40 to-blue-900/30 flex items-center justify-center">
        <span className="text-6xl opacity-40">{typeIconMap[event.type] || "🎉"}</span>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">{event.type || "General"}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${event.status === "confirmed" ? "bg-green-600/80 text-white" : event.status === "completed" ? "bg-blue-600/80 text-white" : "bg-yellow-600/80 text-white"}`}>{event.status}</span>
        </div>
        {event.ticket_price > 0 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">₹{event.ticket_price}</div>
        )}
        {event.ticket_price === 0 && (
          <div className="absolute top-3 right-3 bg-green-600/80 text-white text-xs font-bold px-2 py-1 rounded-full">FREE</div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-semibold text-sm mb-1 leading-tight">{event.title}</h3>
        <p className="text-gray-400 text-xs mb-3 leading-relaxed line-clamp-2">{event.description || "No description provided."}</p>

        <div className="space-y-1 mb-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1"><span>📅</span><span>{formatDate(event.date)}</span></div>
          {event.venue && <div className="flex items-center space-x-1"><span>📍</span><span>{event.venue}</span></div>}
          <div className="flex items-center space-x-1"><span>👥</span><span>{event.attendees?.length || 0} registered</span></div>
          {event.createdBy?.name && <div className="flex items-center space-x-1"><span>🎯</span><span>by {event.createdBy.name}</span></div>}
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button onClick={() => onViewDetails(event)}
            className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-lg hover:bg-purple-500/30 transition-colors duration-300">
            View Details
          </button>
          {user?.role === "guest" && !isPast && event.status === "confirmed" && (
            isRegistered ? (
              <button onClick={() => onUnregister(event._id)}
                className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold rounded-lg hover:bg-red-500/30 transition-colors duration-300">
                Unregister
              </button>
            ) : (
              <button onClick={() => onRegister(event._id)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300">
                Register Now
              </button>
            )
          )}
          {!user && event.status === "confirmed" && !isPast && (
            <Link to="/signin" className="flex-1 text-center px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300">
              Sign In to Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EventDetailModal({ event, user, onClose, onRegister, onUnregister }) {
  if (!event) return null;
  const isRegistered = user && event.attendees?.some(a => (a._id || a) === user.id);
  const isPast = new Date(event.date) < new Date();
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-purple-500/30 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-white font-bold text-lg leading-tight flex-1 mr-4">{event.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl transition-colors">✕</button>
        </div>

        <div className="space-y-3 text-sm text-gray-300 mb-6">
          <p className="leading-relaxed">{event.description || "No description provided."}</p>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-700">
            <div><span className="text-gray-500 text-xs block">Date</span><span>{formatDate(event.date)}</span></div>
            <div><span className="text-gray-500 text-xs block">Status</span><span className="capitalize">{event.status}</span></div>
            {event.venue && <div><span className="text-gray-500 text-xs block">Venue</span><span>{event.venue}</span></div>}
            <div><span className="text-gray-500 text-xs block">Type</span><span className="capitalize">{event.type || "General"}</span></div>
            <div><span className="text-gray-500 text-xs block">Ticket Price</span><span>{event.ticket_price > 0 ? `₹${event.ticket_price}` : "Free"}</span></div>
            <div><span className="text-gray-500 text-xs block">Registered</span><span>{event.attendees?.length || 0} attendees</span></div>
            {event.createdBy?.name && <div><span className="text-gray-500 text-xs block">Organizer</span><span>{event.createdBy.name}</span></div>}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-700/50 text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">Close</button>
          {user?.role === "guest" && !isPast && event.status === "confirmed" && (
            isRegistered ? (
              <button onClick={() => { onUnregister(event._id); onClose(); }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
                Unregister
              </button>
            ) : (
              <button onClick={() => { onRegister(event._id); onClose(); }}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:to-blue-500 transition-all">
                Register Now
              </button>
            )
          )}
          {!user && event.status === "confirmed" && !isPast && (
            <Link to="/signin" className="flex-1 text-center py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:to-blue-500 transition-all">
              Sign In to Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get("/events");
      setEvents(res.data.events || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Please sign in to view events");
        navigate("/signin");
      } else {
        toast.error("Failed to load events. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleRegister = async (eventId) => {
    if (!user) { navigate("/signin"); return; }
    try {
      await API.post(`/events/${eventId}/register`);
      toast.success("🎉 Successfully registered for the event!");
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await API.post(`/events/${eventId}/unregister`);
      toast.success("Unregistered from the event.");
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unregistration failed");
    }
  };

  const filteredEvents = events
    .filter(e => selectedCategory === "all" || e.type === selectedCategory)
    .filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.description || "").toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      if (sortBy === "price") return (a.ticket_price || 0) - (b.ticket_price || 0);
      if (sortBy === "attendees") return (b.attendees?.length || 0) - (a.attendees?.length || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Hero */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🎪</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Discover <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text">Unforgettable</span> Events
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">From intimate gatherings to grand celebrations — find your next extraordinary experience</p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <input type="text" placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300" />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </section>

      {/* Role Banner for hosts */}
      {user?.role === "host" && (
        <section className="relative px-4 sm:px-6 lg:px-8 mb-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-red-300 text-sm">You're viewing all events as a <span className="font-bold">Host</span>. Manage your events from My Events.</p>
              <Link to="/myevents" className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">Go to My Events →</Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="relative py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {eventCategories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${selectedCategory === cat.id ? "bg-purple-600 text-white border-purple-500" : "bg-black/40 text-gray-300 border-purple-500/20 hover:border-purple-500/50"}`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sort + Events Grid */}
      <section className="relative py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">{loading ? "Loading..." : `${filteredEvents.length} Event${filteredEvents.length !== 1 ? "s" : ""} Found`}</h2>
              <p className="text-gray-400 text-sm">Don't miss these incredible experiences</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-black/40 border border-gray-600 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-purple-500">
                <option value="date">Date</option>
                <option value="attendees">Most Popular</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-black/40 rounded-xl h-72 animate-pulse border border-purple-500/10"></div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎟️</div>
              <h3 className="text-white font-bold text-lg mb-2">No events found</h3>
              <p className="text-gray-400 text-sm">
                {searchQuery ? "Try a different search term" : selectedCategory !== "all" ? "No events in this category yet" : user ? "No events available right now. Check back soon!" : <><Link to="/signin" className="text-purple-400 underline">Sign in</Link> to see available events</>}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} user={user} onRegister={handleRegister} onUnregister={handleUnregister} onViewDetails={setSelectedEvent} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA for guests */}
      {!user && (
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-3">Ready to Join?</h2>
              <p className="text-gray-300 text-sm mb-6">Sign up as a guest to register for events, or as a host to create and manage your own events.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signupguest" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-blue-500 transition-all">Join as Guest 🎪</Link>
                <Link to="/signuphost" className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-sm hover:from-red-500 hover:to-red-600 transition-all">Become a Host 🎯</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <EventDetailModal event={selectedEvent} user={user} onClose={() => setSelectedEvent(null)} onRegister={handleRegister} onUnregister={handleUnregister} />
    </div>
  );
}
