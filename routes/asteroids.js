const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');
const ensureLoggedIn = require('../config/ensureLoggedIn');

//- CREATE ASTEROIDS ROUTES -// ----------------------

router.get('/add-asteroid', ensureLoggedIn, asteroidController.new);

router.post('/', ensureLoggedIn, asteroidController.create);

//- SHOW ROUTES -// -------------------------

router.get('/', ensureLoggedIn, asteroidController.showAll);

router.get('/:id', ensureLoggedIn, asteroidController.show);

//- EDIT ASTEROIDS ROUTES -// ----------------------

router.get('/:id/edit', ensureLoggedIn, asteroidController.edit);

router.put('/:id', ensureLoggedIn, asteroidController.update);

//- DELETE ROUTES -// ----------------------

router.get('/:id/delete', ensureLoggedIn, asteroidController.find);

router.delete('/:id', ensureLoggedIn, asteroidController.delete);

// - CREATE PICTURES ROUTE - //

router.post('/:id', ensureLoggedIn, asteroidController.createPictures);

router.delete(`/:id/:picture_id/delete-img`, asteroidController.deletePictures);

module.exports = router;
