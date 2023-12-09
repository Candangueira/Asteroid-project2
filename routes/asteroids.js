const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroids');

//- CREATE ROUTES -// ----------------------

router.get('/add-asteroid', asteroidController.new);
// router.get('/add-asteroid', (req, res) => {
//     // TEST CHECK IF CONNECTS
//     res.send('ok');
// });

router.post('/', asteroidController.create);

//- SHOW ROUTES -// -------------------------

router.get('/', asteroidController.showAll);

router.get('/:id', asteroidController.show);

//- DELETE ROUTES -// ----------------------

router.delete('/:id', asteroidController.delete);

router.get('/:id/delete', asteroidController.find);

module.exports = router;
