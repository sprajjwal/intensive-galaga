const Leaderboard = require("../models/leaderboard");

async function getHighscores() {
  const highscores = await Leaderboard.findOne({})
  return highscores.board.map((score, index)=> {
    const updated_scores = {}
    updated_scores.rank = index + 1
    updated_scores.name = score.name
    updated_scores.score = score.score
    return updated_scores
  })
}
module.exports = getHighscores;