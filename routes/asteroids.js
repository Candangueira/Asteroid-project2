const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');

router.get('/', asteroidController.showAll);

router.get('/date', asteroidController.date);

router.get('/add-asteroid', asteroidController.new);

router.get('/:id', asteroidController.show);

router.post('/', asteroidController.create);

module.exports = router;
