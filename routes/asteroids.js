const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');

router.get('/add-asteroid', asteroidController.new);

router.post('/', asteroidController.create);

router.get('/', asteroidController.showAll);

module.exports = router;
