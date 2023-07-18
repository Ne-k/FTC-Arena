const mongoose = require('mongoose')

module.exports = mongoose.model("Scores", new mongoose.Schema({
    matchNumber: {type: Number},
    red1: {type: Number},
    red2: {type:Number},
    blue1: {type: Number},
    blue2: {type: Number},
    red1TeamName: {type: String},
    red2TeamName: {type: String},
    blue1TeamName: {type: String},
    blue2TeamName: {type: String}
}))
