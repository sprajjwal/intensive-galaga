const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const LeaderboardSchema = new Schema({
    size: {type: Number, default: 0, required: true},
    board: [{
        name: {type: String, default: function() {
            return `User${mongoose.Types.ObjectId}`
        }},
        score: {type: Number, required: true}
    }]
})

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);