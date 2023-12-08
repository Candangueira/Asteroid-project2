const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');

//- SHOW ROUTES -// -------------------------

router.get('/', asteroidController.showAll);

router.get('/:id', asteroidController.show);

//- CREATE ROUTES -// ----------------------

router.get('/add-asteroid', asteroidController.new);

router.post('/', asteroidController.create);

//- DELETE ROUTES -// ----------------------

router.delete('/:id', asteroidController.delete);

router.get('/:id/delete', asteroidController.find);

module.exports = router;
