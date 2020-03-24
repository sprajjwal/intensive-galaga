const Leaderboard = require('../models/leaderboard')
const Lobby = require('../models/lobby')

module.exports = function(app) {
  // send high score here
  app.post('/add_score', async (req, res) => {
    // const player = req.body.player
    const player = {}
    player.name = "shaash"
    player.score = 100000
    let leaderboard = await Leaderboard.findOne({})
    for (index in leaderboard.board) {
      if (leaderboard.board[index].score < player.score) {
        leaderboard.board.splice(index, 0, player)
        leaderboard.markModified("board")
        break
      }
    }
    leaderboard.save()
    return res.redirect("/")
  })
  
  app.get('/multiplayer', async (req, res) => {
    const lobbies = await Lobby.find({})
    const context = {
      lobbies: lobbies.map(lobby => lobby.toJSON())
    }
    return res.render('multiplayer-form', {lobbies: context.lobbies})
  })

  app.get('/multiplayer1', async (req, res) => {
    const lobby =  new Lobby()
    lobby.name = "test lobby"
    lobby.currentPlayers = 2
    lobby.totalPlayers = 4
    lobby.isComplete = false
    lobby.scores = [
      {
        user: "shaash",
        score: 53
      },
      {
        user: "sal",
        score: 21
      }
    ]
    lobby.save()
    return res.send("done")
  })
}