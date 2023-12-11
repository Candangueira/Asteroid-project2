const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// - CREATE PICTURES ROUTE - //

router.post('/:id', ensureLoggedIn, asteroidController.createPictures);

// router.delete('/:id', asteroidController.deletePictures); // UNCOMMENT THIS ROUTE DELETE PICTURES

//- CREATE ASTEROIDS ROUTES -// ----------------------

router.get('/add-asteroid', ensureLoggedIn, asteroidController.new);

router.post('/', ensureLoggedIn, asteroidController.create);

//- SHOW ROUTES -// -------------------------

router.get('/', ensureLoggedIn, asteroidController.showAll);

router.get('/:id', ensureLoggedIn, asteroidController.show);

//- DELETE ROUTES -// ----------------------

router.delete('/:id', ensureLoggedIn, asteroidController.delete);

router.get('/:id/delete', ensureLoggedIn, asteroidController.find);

module.exports = router;
