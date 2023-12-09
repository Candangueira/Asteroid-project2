const Asteroid = require('../models/asteroid');

module.exports = {
    showAll,
    show,
    new: newAsteroid,
    create: createAsteroid,
    delete: deleteAsteroid,
    find: findAsteroid,
};

// Add a form for a new asteroid //
async function newAsteroid(req, res) {
    try {
        res.render('new-asteroid.ejs');
    } catch (err) {
        console.log(err);
        res.redirect('/', { errorMsg: err.message });
    }
}

// Create and Post the new Asteroid //
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
    // adds the new asteroid to the datebase //
    const userAddedAsteroids = await Asteroid.find({});
    console.log('DATABASE:' + userAddedAsteroids);

    // query string

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

            // iterate through NASA asteroids //

            dates.forEach((date) => {
                listOfAsteroids[date].forEach((nasaAsteroid) => {
                    console.log(nasaAsteroid._id);
                });
            });

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

async function show(req, res, next) {
    const asteroid = await Asteroid.findById(req.params.id);
    res.render('single-asteroid.ejs', {
        asteroid,
    });
}

// WORKING HERE //
// Find Asteroid to delete //
async function findAsteroid(req, res) {
    res.send('confirm-delete');
}

async function deleteAsteroid(req, res) {
    const userAsteroid = await Asteroid.findById({
        'asteroid._id': req.params.id,
    });
    userAsteroid.remove(req.params.id);
    await userAsteroid.save();
    res.redirect('/asteroids');
}
