const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const LobbySchema = new Schema({
  name: {type: String, required: true, unique: true},
  totalPlayers: {type: Number, required: true, default: 2},
  isComplete: {type: Boolean, default: false},
  scores: [{
    user: {type: String, required: true},
    score: {type: Number, required: true}
  }],
  createdAt: {type: Date}
});

LobbySchema.pre("save", function(next) {
  const now = new Date();
  this.createdAt = now;
})

