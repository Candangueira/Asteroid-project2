// const { text } = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const asteroidSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        magnitude: {
            type: mongoose.Types.Decimal128,
            required: true,
        },
        diameter: {
            type: Number,
            required: true,
        },
        hazardous: {
            type: Boolean,
            default: false,
            required: true,
        },
        date: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Asteroid', asteroidSchema);
