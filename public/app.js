// Load random joke
async function loadRandomJoke() {
    const res = await fetch('/jokebook/random');
    const data = await res.json();
    document.getElementById('random-setup').textContent = data.setup;
    document.getElementById('random-delivery').textContent = data.delivery;
  }
  
  document.getElementById('new-random').addEventListener('click', loadRandomJoke);
  loadRandomJoke();
  
  // Load jokes from a category
  document.getElementById('load-category').addEventListener('click', async () => {
    const category = document.getElementById('category-input').value.trim();
    const res = await fetch(`/jokebook/joke/${category}`);
    const jokes = await res.json();
  
    const list = document.getElementById('category-jokes');
    list.innerHTML = '';
  
    if (jokes.error) {
      list.innerHTML = `<li>${jokes.error}</li>`;
    } else {
      jokes.forEach(j => {
        const li = document.createElement('li');
        li.textContent = `${j.setup} - ${j.delivery}`;
        list.appendChild(li);
      });
    }
  });
  
  // Add a new joke
  document.getElementById('submit-joke').addEventListener('click', async () => {
    const category = document.getElementById('add-category').value.trim();
    const setup = document.getElementById('add-setup').value.trim();
    const delivery = document.getElementById('add-delivery').value.trim();
  
    const res = await fetch('/jokebook/joke/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, setup, delivery })
    });
  
    const result = await res.json();
    const output = document.getElementById('add-result');
  
    if (result.error) {
      output.textContent = result.error;
    } else {
      output.textContent = `Joke added to "${category}"! (${result.length} joke(s) in this category)`;
    }
  });
  