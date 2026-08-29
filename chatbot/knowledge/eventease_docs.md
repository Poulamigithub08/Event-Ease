# EventEase — Complete Knowledge Base

## What is EventEase?
EventEase is a full-stack web application for managing events. It supports two types of users:
- **Hosts** — people who create, manage, and organize events
- **Guests** — people who discover and register for events

---

## Roles & Permissions

### Host Role
- Can create new events
- Can edit their own events (title, description, date, venue, type, status, budget, ticket price, progress)
- Can delete their own events
- Can view the list of attendees (guests) registered to their events
- Can change event status: Draft → Confirmed → Completed / Cancelled
- Can track planning progress (0–100%)
- Sees all events including drafts on the Events page
- Dashboard (My Events) shows: Upcoming, Past, Drafts, Total stats

### Guest Role
- Can browse all confirmed/completed events on the Events page
- Can register for any confirmed upcoming event
- Can unregister from events they have registered for
- Cannot see draft or cancelled events
- Dashboard (My Events) shows registered events split into Upcoming and Past

---

## Pages & Features

### Home Page (/)
Landing page of EventEase with hero section and overview.

### Events Page (/events)
- Shows all available events
- Has a search bar to search by event title or description
- Has category filters: All, Weddings & Parties, Corporate Events, Music & Entertainment, Conferences, Sports & Fitness, Community & Charity, General
- Sort by: Date, Most Popular (attendees), Price
- Each event card shows: title, type, status badge, ticket price (or FREE), date, venue, attendee count, organizer name
- Guests see Register Now / Unregister buttons on confirmed events
- Clicking "View Details" opens a modal with full event information
- Not logged in users see "Sign In to Register" button

### My Events Page (/myevents)
- Shows events relevant to the logged-in user
- **Hosts** see tabs: Upcoming, Past, Drafts — with Create New Event button
- **Guests** see tabs: Upcoming, Past
- Host actions per event card: Details, Edit, Guests (view attendees), Delete
- Guest actions: View Details

### Sign In Page (/signin)
- Email + Password login
- Links to sign up as Host or Guest
- On success, redirects to /myevents

### Sign Up as Host (/signuphost)
- Name, Email, Password, Confirm Password
- Role is automatically set to "host"
- After signup, redirected to /signin

### Sign Up as Guest (/signupguest)
- First Name, Last Name, Email, Phone (optional), Location (optional), Interests (optional), Password, Confirm Password
- Role is automatically set to "guest"
- After signup, redirected to /signin

### Contact Us (/contactus)
- Contact form for reaching the EventEase team

### About Us (/aboutus)
- Information about the EventEase platform and team

### Services (/services)
- Overview of EventEase services

### Gallery (/gallery)
- Photo gallery of past events

### Blogs (/blogs)
- Blog posts related to events and event management

---

## Event Fields
| Field | Description |
|-------|-------------|
| Title | Name of the event (required) |
| Description | Details about the event |
| Date | Date of the event (required) |
| Venue | Location where event is held |
| Type | Category: general, wedding, corporate, music, conference, sports, community |
| Status | draft, confirmed, completed, cancelled |
| Budget | Total budget for the event (₹) |
| Ticket Price | Cost per ticket in ₹ (0 = Free) |
| Progress | Planning completion % (0–100) |
| Attendees | List of guests who registered |

---

## Event Status Lifecycle
1. **Draft** — event is being planned, not visible to guests
2. **Confirmed** — event is public, guests can register
3. **Completed** — event has happened, visible but registration closed
4. **Cancelled** — event is cancelled

---

## How to Create an Event (Host)
1. Log in as a Host
2. Go to My Events (/myevents)
3. Click "Create New Event" button
4. Fill in: Title (required), Description, Date (required), Venue, Type, Budget, Ticket Price
5. Status defaults to Draft — change to Confirmed to make it visible to guests
6. Click "Create Event"

## How to Register for an Event (Guest)
1. Log in as a Guest
2. Go to Events (/events)
3. Find an event with status "Confirmed"
4. Click "Register Now" on the event card or in the event detail modal
5. You'll see the event in My Events under Upcoming tab

## How to Unregister from an Event (Guest)
1. Go to Events page or My Events page
2. Find the event you registered for
3. Click "Unregister" button

## How to Edit an Event (Host)
1. Go to My Events page
2. Find the event and click "Edit" button
3. Modify any fields including status, progress slider
4. Click "Save Changes"

## How to Delete an Event (Host)
1. Go to My Events page
2. Click the 🗑️ delete button on the event card
3. Confirm deletion in the dialog

## How to View Attendees (Host)
1. Go to My Events page
2. Click "Guests" button on any event card
3. A modal shows all registered guests with their name and email

---

## Authentication
- JWT (JSON Web Token) based authentication
- Token stored in localStorage
- All event-related routes require authentication
- Token is sent in Authorization header: `Bearer <token>`
- Session ends when user logs out (token removed from localStorage)

---

## FAQ

**Q: Can I sign up as both a Host and a Guest?**
A: No, each account has one role (either Host or Guest). You need separate accounts for each role.

**Q: Can guests create events?**
A: No. Only hosts can create, edit, and delete events.

**Q: Are all events visible to guests?**
A: Guests can only see events with status "confirmed" or "completed". Draft and cancelled events are not shown to guests.

**Q: Is registration free?**
A: Registration on EventEase is free. Individual events may have a ticket price set by the host. Events with ticket_price = 0 are shown as FREE.

**Q: Can I register for a past event?**
A: No. Registration is only allowed for upcoming confirmed events (events with a future date).

**Q: How do I become a host?**
A: Sign up using the "Sign Up as Host" option on the sign-in page or go directly to /signuphost.

**Q: Can a host register for someone else's event?**
A: No. Only guests can register for events.

**Q: What happens after I delete an event?**
A: The event is permanently deleted along with all registrations. This cannot be undone.

**Q: How many events can I create?**
A: There is no limit on the number of events a host can create.

**Q: Can I cancel a confirmed event?**
A: Yes. Hosts can change an event's status from Confirmed to Cancelled by editing the event.

**Q: What is the progress bar on events?**
A: It's a planning progress indicator (0–100%) that hosts can manually update to track how ready their event is.

**Q: How do I contact EventEase support?**
A: Go to the Contact Us page (/contactus) and fill out the contact form.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS, React Router, Axios, React Toastify
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Chatbot**: Python, FastAPI, Ollama, Gemma 3n (local AI model)

---

## Navigation
- Home → /
- Events → /events (browse all events)
- My Events → /myevents (your personal dashboard)
- About Us → /aboutus
- Services → /services
- Gallery → /gallery
- Blogs → /blogs
- Contact Us → /contactus
- Sign In → /signin
- Sign Up as Host → /signuphost
- Sign Up as Guest → /signupguest
