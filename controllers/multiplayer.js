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
    try{
      await lobby.save()
      return res.redirect('/multiplayer')
    } catch (err) {
      const lobbies = await Lobby.find({})
      const context = {
        lobbies: lobbies.map(lobby => lobby.toJSON()),
        highscores: await getHighscore()
      }
      return res.render('multiplayer', {lobbies: context.lobbies, highscores: context.highscores, errorMSG: true})
    }
  })

  app.get('/multiplayer/:name', async (req, res)=> {
    console.log(req.params.name)
    const context = {
      lobby: req.params.name,
      highscores: await getHighscore()
    }
    return res.render('multiplayer-form', {lobbyName: context.lobby, highscores: context.highscores})
  })
}