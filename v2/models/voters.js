var mongoose = require("mongoose");

var voterSchema = new mongoose.Schema({
    name: String,
    votes: Number
});

module.exports = mongoose.model("Voter", voterSchema);