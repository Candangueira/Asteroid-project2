const { query } = require('express');
const Asteroid = require('../models/asteroid');
const mongoose = require('mongoose');

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
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;

        const newAsteroid = await Asteroid.create(req.body);

        newAsteroid.pictures.push(req.body);

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
    // gets the id or _id //
    const asteroidId = req.params.id;

    // checking if its an Object._id or not //
    const mongooseIsValid = mongoose.isValidObjectId(asteroidId);

    let asteroid;

    // Single Asteroid finder // ---------------------------------------------------------------------

    // renders the USER single-asteroid // ---------------------------------------------------------------

    // if its an Object._id do: //
    if (mongooseIsValid) {
        asteroid = await Asteroid.findById(asteroidId);
    }
    // if asteroid isnt falsy ( exist in the database) //
    // return assure that the function stops there if its true //
    if (asteroid) {
        return res.render('single-asteroid.ejs', {
            asteroid,
        });
    }
    // otherwise it will access the NASA API //

    const nasaAsteroidsReq = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${process.env.NASA_API_KEY}`
    );

    const nasaAsteroid = await nasaAsteroidsReq.json();

    // try {
    //     if (nasaAsteroidsReq.ok) {
    //         return nasaAsteroid;
    //     }
    // } catch (err) {
    //     console.log(err);
    // }

    //
    res.render('nasa-single-asteroid.ejs', {
        asteroid: nasaAsteroid,
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
