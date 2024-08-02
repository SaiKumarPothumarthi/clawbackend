import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Create an event
router.post('/create', async (req, res) => {
  const { name, date, location, description,eventby } = req.body;
  try {
    const event = new Event({ name, date,eventby,location, description });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an event by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date,eventby, location, description } = req.body;
  try {
    const event = await Event.findByIdAndUpdate(id, { name, date, location,eventby,description }, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an event by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
