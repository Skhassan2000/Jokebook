const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');

router.get('/categories', jokeController.getCategories);
router.get('/joke/:category', jokeController.getJokesByCategory);
router.get('/random', jokeController.getRandomJoke);
router.post('/joke/add', jokeController.addJoke);

module.exports = router;
