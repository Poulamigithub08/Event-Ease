const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/authmiddleware");

// All routes require authentication
router.use(authMiddleware);

router.get("/", eventController.getEvents);
router.post("/", eventController.createEvent);
router.get("/my-events", eventController.getMyEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.post("/:id/register", eventController.registerForEvent);
router.post("/:id/unregister", eventController.unregisterFromEvent);

module.exports = router;
