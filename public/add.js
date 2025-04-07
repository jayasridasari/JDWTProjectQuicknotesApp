const contentInput = document.getElementById('content');
const preview = document.getElementById('preview');

// Live Markdown preview
contentInput.addEventListener('input', () => {
  preview.innerHTML = marked.parse(contentInput.value);
});

document.getElementById('noteForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const content = contentInput.value;
  const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content, tags })
  });

  if (response.ok) {
    document.getElementById('message').textContent = 'Note saved successfully!';
    document.getElementById('noteForm').reset();
    preview.innerHTML = '';
  } else {
    document.getElementById('message').textContent = 'Failed to save note.';
  }
});
