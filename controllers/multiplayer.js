const Leaderboard = require('../models/leaderboard')
const Lobby = require('../models/lobby')
const getHighscore = require("../utils/scores")

module.exports = function(app) {
  // send high score here
  app.post('/add_score', async (req, res) => {
    const player = req.body
    console.log(player.score)
    // const player = {}
    // player.name = "shaash"
    // player.score = 100000
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
      lobbies: lobbies.map(lobby => lobby.toJSON()),
      highscores: await getHighscore()
    }
    return res.render('multiplayer', {lobbies: context.lobbies, highscores: context.highscores})
  })

  app.post('/multiplayer', async (req, res) => {
    const lobby =  new Lobby(req.body)
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
    try{
      await lobby.save()
    } catch (err) {
      const lobbies = await Lobby.find({})
      const context = {
        lobbies: lobbies.map(lobby => lobby.toJSON()),
        highscores: await getHighscore()
      }
      return res.render('multiplayer', {lobbies: context.lobbies, highscores: context.highscores, errorMSG: true})
    }
    
    return res.redirect('/multiplayer')
  })

  app.get('/multiplayer/:name', (req, res)=> {
    return res.render('multiplayer-form')
  })
}