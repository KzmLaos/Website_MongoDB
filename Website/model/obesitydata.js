const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

//Define schema for the dataset called obesity.data
const obesitydataschema = new Schema ({

    //Fields to structure the obesitydata dataset
    Age: {
        type: Number,
        required: true
    },

    Gender: {
        type: String,
        required: true
    },

    Height: {
        type: Number,
        required: true
    },

    Weight: {
        type: Number,
        required: true

    },

    CALC: {
        type: String,
        required: true
    },

    FAVC: {
        type: String,
        required: true
    },

    FCVC: {
        type: Number,
        required: true
    },

    NCP: {
        type: Number,
        required: true
    },

    SCC: {
        type: String,
        required: true
    },

    SMOKE: {
        type: String,
        required: true
    },

    CH20: {
        type: Number,
        required: true
    },

    family_history_with_overweight: {
        type: String,
        required: true
    },

    FAF: {
        type: Number,
        required: true
    },

    TUE: {
        type: Number,
        required: true
    },

    CAEC: {
        type: String,
        required: true
    },

    MTRANS: {
        type: String,
        required: true
    },

    NObeyesdad: {
        type: String,
        required: true
    }

}, {timestamps: true});

// Create a model 
const ObesityData = mongoose.model('obesity', obesitydataschema);

//Export model for using in more parts of the application
module.exports = ObesityData;







