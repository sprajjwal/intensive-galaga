const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const LobbySchema = new Schema({
  name: {type: String, required: true, unique: true},
  totalPlayers: {type: Number, required: true, default: 2},
  currentPlayers: {type: Number, default: 0},
  isComplete: {type: Boolean, default: false},
  scores: [{
    user: {type: String,},
    score: {type: Number}
  }],
  createdAt: {type: Date}
},  { minimize: false });

LobbySchema.pre("save", function(next) {
  const now = new Date();
  this.createdAt = now;
  next()
})

module.exports = mongoose.model("Lobby", LobbySchema);
