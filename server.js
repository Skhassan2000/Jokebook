const express = require('express');
const app = express();
const jokeRoutes = require('./routes/jokeRoutes');

app.use(express.json());
app.use(express.static('public')); // Serve frontend files
app.use('/jokebook', jokeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jokebook server is running on port ${PORT}`);
});

