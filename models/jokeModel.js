const db = require('./db');

const getCategories = (callback) => {
  db.all('SELECT name FROM categories', [], callback);
};

const getJokesByCategory = (category, limit, callback) => {
  const sql = `
    SELECT jokes.setup, jokes.delivery 
    FROM jokes 
    JOIN categories ON jokes.category_id = categories.id 
    WHERE categories.name = ? 
    LIMIT ?
  `;
  db.all(sql, [category, limit || 100], callback);
};

const getRandomJoke = (callback) => {
  const sql = `
    SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1
  `;
  db.get(sql, [], callback);
};

const addJoke = (category, setup, delivery, callback) => {
  db.get('SELECT id FROM categories WHERE name = ?', [category], (err, row) => {
    if (err) return callback(err);

    const insertJoke = (categoryId) => {
      db.run(
        `INSERT INTO jokes (category_id, setup, delivery) VALUES (?, ?, ?)`,
        [categoryId, setup, delivery],
        (err) => {
          if (err) return callback(err);
          getJokesByCategory(category, null, callback); // return updated list
        }
      );
    };

    if (row) {
      insertJoke(row.id);
    } else {
      db.run(`INSERT INTO categories (name) VALUES (?)`, [category], function (err) {
        if (err) return callback(err);
        insertJoke(this.lastID);
      });
    }
  });
};

module.exports = {
  getCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke
};
