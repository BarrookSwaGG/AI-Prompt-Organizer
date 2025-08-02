function savePrompt() {
  const prompt = document.getElementById('prompt').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t);

  if (!prompt) return;

  const saved = JSON.parse(localStorage.getItem('prompts') || '[]');
  saved.push({ prompt, tags, favorite: false });
  localStorage.setItem('prompts', JSON.stringify(saved));

  document.getElementById('prompt').value = '';
  document.getElementById('tags').value = '';

  renderPrompts();
}

function renderPrompts() {
  const search = document.getElementById('search').value.toLowerCase();
  const showOnlyFavorites = document.getElementById('showFavoritesOnly')?.checked;
  const container = document.getElementById('prompts');
  const saved = JSON.parse(localStorage.getItem('prompts') || '[]');

  container.innerHTML = '';

  saved
    .filter(p =>
      (!search || p.tags.some(tag => tag.toLowerCase().includes(search))) &&
      (!showOnlyFavorites || p.favorite)
    )
    .forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'prompt-card';
      div.innerHTML = `
        <p>${p.prompt}</p>
        <small>Tags: ${p.tags.join(', ')}</small><br>
        <button onclick="copyPrompt(${i})">Copy</button>
        <button onclick="deletePrompt(${i})">Delete</button>
        <button onclick="toggleFavorite(${i})" title="Favorite">${p.favorite ? '★' : '☆'}</button>
      `;
      container.appendChild(div);
    });
}

function copyPrompt(index) {
  const saved = JSON.parse(localStorage.getItem('prompts') || '[]');
  navigator.clipboard.writeText(saved[index].prompt);
  alert('Prompt copied!');
}

function deletePrompt(index) {
  const saved = JSON.parse(localStorage.getItem('prompts') || '[]');
  if (confirm("Delete this prompt?")) {
    saved.splice(index, 1);
    localStorage.setItem('prompts', JSON.stringify(saved));
    renderPrompts();
  }
}

function toggleFavorite(index) {
  const saved = JSON.parse(localStorage.getItem('prompts') || '[]');
  saved[index].favorite = !saved[index].favorite;
  localStorage.setItem('prompts', JSON.stringify(saved));
  renderPrompts();
}

// Initial render
renderPrompts();