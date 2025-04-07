const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Note = require('./models/Note');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all notes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Search notes by tag
app.get('/api/notes/search', async (req, res) => {
  const tag = req.query.tag;
  const notes = await Note.find({ tags: tag });
  res.json(notes);
});

// Add new note
app.post('/api/notes', async (req, res) => {
  const { title, content, tags } = req.body;
  const newNote = new Note({ title, content, tags });
  await newNote.save();
  res.json(newNote);
});
// GET single note by ID
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// Edit note
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(id, { title, content, tags }, { new: true });
  res.json(updatedNote);
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
