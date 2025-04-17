const Joke = require('../models/jokeModel');
const fetch = require('node-fetch');

exports.getJokesByCategory = async (req, res) => {
  const { category } = req.params;
  const limit = req.query.limit;

  Joke.getJokesByCategory(category, limit, async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length > 0) {
      return res.json(rows); // return local results
    }

    // ❗ Try to fetch from JokeAPI if not found locally
    try {
      const response = await fetch(`https://sv443.net/jokeapi/v2/${category}?type=twopart&amount=3`);
      const data = await response.json();

      // If no jokes found
      if (data.error || !data.jokes) {
        return res.status(404).json({ error: `No jokes found in external API for category: ${category}` });
      }

      // Add each joke to DB under the new category
      const jokesToAdd = data.jokes.map(j => ({
        category,
        setup: j.setup,
        delivery: j.delivery
      }));

      let addedCount = 0;

      for (const joke of jokesToAdd) {
        await new Promise((resolve, reject) => {
          Joke.addJoke(joke.category, joke.setup, joke.delivery, (err) => {
            if (err) return reject(err);
            addedCount++;
            resolve();
          });
        });
      }

      // Return newly added jokes
      Joke.getJokesByCategory(category, limit, (err, newRows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(newRows);
      });

    } catch (apiErr) {
      console.error(apiErr);
      res.status(500).json({ error: 'Failed to fetch jokes from external API.' });
    }
  });
};
