// Load all notes on page load
window.onload = fetchNotes;
let currentEditId = null;
// const res = await fetch(`/api/notes/${id}`);
// const note = await res.json(); // this fails if 404 page is returned

// const res = await fetch(`/api/notes/${id}`);
// if (!res.ok) {
//   alert('Error fetching note. Check if the route exists.');
//   return;
// }
// const note = await res.json();

async function fetchNotes() {
  const res = await fetch('https://jdwtprojectquicknotesapp.onrender.com/api/notes');
  const notes = await res.json();
  displayNotes(notes);
}

async function searchNotes() {
  const tag = document.getElementById('searchInput').value.trim();
  const res = await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/search?tag=${tag}`);
  const notes = await res.json();
  displayNotes(notes);
}

function displayNotes(notes) {
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  if (notes.length === 0) {
    container.innerHTML = '<p>No notes found.</p>';
    return;
  }

  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `
  <h3>${note.title}</h3>
  <div>${marked.parse(note.content)}</div>
  <small>Tags: ${note.tags.join(', ')}</small><br>
  <button onclick="openEdit('${note._id}')">Edit</button>
  <button onclick="deleteNote('${note._id}')">Delete</button>
`;


    container.appendChild(div);
  });
}

async function updateField(id, field, value) {
  // Check if this is markdown content
  const el = document.querySelector(`[onblur*="${id}"]`);
  const rawContent = el?.getAttribute('data-raw') || value;

  const res = await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/${id}`);
  const note = await res.json();

  note[field] = field === 'content' ? rawContent : value;

  await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });

  // Re-render to show markdown
  fetchNotes();
}


async function updateTags(id, text) {
  const tags = text.replace('Tags:', '').split(',').map(tag => tag.trim());
  const res = await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/${id}`);
  const note = await res.json();

  note.tags = tags;

  await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
}

async function deleteNote(id) {
  if (confirm('Are you sure you want to delete this note?')) {
    await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  }
}
async function openEdit(id) {
  console.log('Editing note:', id);
  currentEditId = id;

  const res = await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/${id}`);
  const note = await res.json();

  document.getElementById('editTitle').value = note.title;
  document.getElementById('editContent').value = note.content;
  document.getElementById('editTags').value = note.tags.join(', ');

  document.getElementById('editModal').classList.remove('hidden');
}

function closeEdit() {
  currentEditId = null;
  document.getElementById('editModal').classList.add('hidden');
}

async function saveEdit() {
  const title = document.getElementById('editTitle').value;
  const content = document.getElementById('editContent').value;
  const tags = document.getElementById('editTags').value.split(',').map(tag => tag.trim());

  await fetch(`https://jdwtprojectquicknotesapp.onrender.com/api/notes/${currentEditId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, tags })
  });

  closeEdit();
  fetchNotes();
}
