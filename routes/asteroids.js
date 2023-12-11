const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// - CREATE PICTURES ROUTE - //

router.post('/:id', ensureLoggedIn, asteroidController.createPictures);

router.delete('/:id/delete-img', asteroidController.deletePictures); // UNCOMMENT THIS ROUTE DELETE PICTURES

//- CREATE ASTEROIDS ROUTES -// ----------------------

router.get('/add-asteroid', ensureLoggedIn, asteroidController.new);

router.post('/', ensureLoggedIn, asteroidController.create);

//- SHOW ROUTES -// -------------------------

router.get('/', ensureLoggedIn, asteroidController.showAll);

router.get('/:id', ensureLoggedIn, asteroidController.show);

//- DELETE ROUTES -// ----------------------

router.delete('/:id/delete', ensureLoggedIn, asteroidController.delete);

router.get('/:id', ensureLoggedIn, asteroidController.find);

module.exports = router;
