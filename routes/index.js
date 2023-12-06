const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/date', indexController.date);

router.post('/asteroids', indexController.addDate);

router.get('/', indexController.index);

module.exports = router;
