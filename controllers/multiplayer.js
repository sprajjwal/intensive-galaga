const Leaderboard = require('../models/leaderboard')
// const Post = require('../models/post')

module.exports = function(app) {
  app.get('/add_score', async (req, res) => {
    const player = req.body.player
    player.name = "shaash"
    player.score = 100000
    let leaderboard = await Leaderboard.find({})
    for (index in leaderboard.board) {
      if (leaderboard.board[index].score < player.score) {
        leaderboard.board.splice(index, 0, player)
        leaderboard.markModified("board")
      }
    }
    leaderboard.save()
    return res.send("hello")
  })
  
}