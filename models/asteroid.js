const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const picturesSchema = new Schema(
    {
        link: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

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
            required: true,
        },
        pictures: [picturesSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Asteroid', asteroidSchema);
