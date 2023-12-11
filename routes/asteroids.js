const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// - CREATE PICTURES ROUTE - //

router.post('/:id', ensureLoggedIn, asteroidController.createPictures);

router.delete(`/:id/:picture_id/delete-img`, asteroidController.deletePictures);

//- CREATE ASTEROIDS ROUTES -// ----------------------

router.get('/add-asteroid', ensureLoggedIn, asteroidController.new);

router.post('/', ensureLoggedIn, asteroidController.create);

//- EDIT ASTEROIDS ROUTES -// ----------------------

router.get('/:id/edit', ensureLoggedIn, asteroidController.edit);

router.put('/:id', ensureLoggedIn, asteroidController.update);

//- SHOW ROUTES -// -------------------------

router.get('/', ensureLoggedIn, asteroidController.showAll);

router.get('/:id', ensureLoggedIn, asteroidController.show);

//- DELETE ROUTES -// ----------------------

router.delete('/:id/delete', ensureLoggedIn, asteroidController.delete);

router.get('/:id', ensureLoggedIn, asteroidController.find);

module.exports = router;
