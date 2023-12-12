const { query } = require('express');
const Asteroid = require('../models/asteroid');

module.exports = {
    showAll,
    show,
    new: newAsteroid,
    create: createAsteroid,
    delete: deleteAsteroid,
    find: findAsteroid,
    createPictures,
    deletePictures,
    edit: editAsteroid,
    update: updateAsteroid,
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
        newAsteroid.pictures.push(req.body);
        // console.log(newAsteroid);
        res.redirect('/asteroids');
    } catch (err) {
        console.log(err);
        res.render('new-asteroid.ejs', { errorMsg: err.message });
    }
}

// CREATES PICTURES FOR A SINGLE ASTEROID // -------------------------------------

async function createPictures(req, res) {
    const asteroid = await Asteroid.findById(req.params.id);
    asteroid.pictures.push(req.body);
    //  req.body.user = req.user._id;
    //  req.body.userName = req.user.name;
    //  req.body.userAvatar = req.user.avatar;

    try {
        await asteroid.save();
    } catch (err) {
        console.log(err);
    }
    res.redirect(`/asteroids/${req.params.id}`);
}

// DELETES PICTURES FOR A SINGLE ASTEROID // ------------------------------------

async function deletePictures(req, res) {
    const asteroid = await Asteroid.findById(req.params.id);
    const pictureToKeep = asteroid.pictures.filter((picture) => {
        // console.log(picture._id.toString());
        return picture._id.toString() !== req.params.picture_id;
    });
    asteroid.pictures = pictureToKeep;

    await asteroid.save();

    res.redirect(`/asteroids/${asteroid._id}`);
}

// shows a list of asteroids near to the earth. // -----------------------------------------------------------------------------
// API NASA Asteroids - NeoWs: // ----------------------------------------------------------------------------------------------

async function showAll(req, res, next) {
    // adds the new asteroid to the datebase //
    const userAddedAsteroids = await Asteroid.find({});

    // Creates variables for the date form. //
    let initialDate = (await req.query.initialDate) ?? '2024-01-01';
    let endDate = (await req.query.endDate) ?? '2024-01-01';

    // Converts the date to ISO 8601 calendar date extended format. //
    const convertedInitialDate = new Date(initialDate);
    const convertedEndDate = new Date(endDate);

    // If the date is valid applies into the API, if not, redirect with default values. //
    if (
        convertedEndDate.getTime() - convertedInitialDate.getTime() <
        7 * 24 * 60 * 60 * 1000
    ) {
        console.log('DATE: Less than 7 days');
    } else {
        initialDate = '2024-01-01';
        endDate = '2024-01-01';
        res.redirect('/asteroids');
    }

    // console.log('DATABASE:' + userAddedAsteroids);
    // console.log(
    //     'QUERY STRING:' +
    //         ' initial-date: ' +
    //         initialDate +
    //         ' end-date: ' +
    //         endDate
    // );

    const asteroids = fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${initialDate}&end_date=${endDate}&api_key=${process.env.NASA_API_KEY}`
    );

    // Filtering the promisse, to get the actual data // ------------------------------------------------

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
                listOfAsteroids[date].forEach((asteroid) => {
                    // nasaAsteroid.push(asteroid); // check this one
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
// -------------------------------------------------------------------------------------------------------

async function show(req, res, next) {
    const asteroidId = await req.params.id;

    // if (req.params.neo_reference_id !== undefined) {
    // Single Asteroid finder API // ---------------------------------------------------------------------
    console.log('nasa-single-asteroid');

    const nasaAsteroids = fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${process.env.NASA_API_KEY}`
    );

    console.log(nasaAsteroids);

    nasaAsteroids
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                return '! NOT an asteroid in NASA database !';
            }
            //throw new Error('404');
        })
        .then((data) => {
            console.log(data);
            const AsteroidData = data;
            console.log('FETCH DATA:' + data);
            // checks if exists a 'neo_reference_id'(that only exists in NASA database) and if it's the same as the ID provided. //
            // if not, opens the 'single-user-page //
            if (AsteroidData.neo_reference_id === asteroidId) {
                res.render('nasa-single-asteroid.ejs', {
                    asteroid: AsteroidData,
                });
            } else {
                console.log(asteroidId);
                const asteroid = Asteroid.findById(asteroidId);
                console.log(asteroid);
                res.render('single-asteroid.ejs', {
                    asteroid,
                });
            }
        })
        .catch((error) => {
            console.log('error 404 catch');
            console.log(error);
        });

    // -----------------------------------------------------------------------------------------------------
}

// edit asteroid //
async function editAsteroid(req, res) {
    const userAsteroid = await Asteroid.findById(req.params.id);
    res.render('edit.ejs', {
        asteroids: userAsteroid,
    });
}

async function updateAsteroid(req, res) {
    const updatedAsteroids = await Asteroid.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.redirect(`/asteroids/${req.params.id}`);
}

// Find Asteroid to delete //
async function findAsteroid(req, res) {
    const userAsteroid = await Asteroid.findById(req.params.id);

    res.render('confirm-delete.ejs', {
        asteroid: userAsteroid,
    });
}

async function deleteAsteroid(req, res) {
    console.log(`Asteroid to be deleted: ${req.params.id}`);
    await Asteroid.findByIdAndDelete(req.params.id);

    res.redirect('/asteroids');
}
