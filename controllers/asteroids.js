const Asteroid = require('../models/asteroid');

module.exports = {
    showAll,
    new: newAsteroid,
    create: createAsteroid,
    date,
};

async function date(req, res) {
    res.render('date.ejs');
}

async function newAsteroid(req, res) {
    res.render('new-asteroid.ejs');
}

async function createAsteroid(req, res) {
    try {
        const newAsteroid = await Asteroid.create(req.body);

        res.redirect('/asteroids');
    } catch (err) {
        console.log(err);
        res.render('new-asteroid.ejs', { errorMsg: err.message });
    }
}

// shows a list of asteroids near to the earth.
// API NASA Asteroids - NeoWs:

async function showAll(req, res, next) {
    const userAddedAsteroids = await Asteroid.find({});
    console.log('DATABASE:' + userAddedAsteroids);

    const asteroids = fetch(
        'https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-01&end_date=2024-01-02&api_key=DEMO_KEY'
    );

    asteroids
        .then((res) => {
            if (res.ok) return res.json();
            throw new Error('404');
        })
        .then((data) => {
            const listOfAsteroids = data.near_earth_objects;

            const dates = Object.keys(listOfAsteroids);

            res.render('asteroid.ejs', {
                userAddedAsteroids,
                dates,
                asteroidsData: data.near_earth_objects,
            });
        })
        .catch((error) => {
            console.log('error 404 catch');
            console.log(error);
        });
}
