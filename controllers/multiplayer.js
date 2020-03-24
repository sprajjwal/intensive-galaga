const Leaderboard = require('../models/leaderboard')
const Lobby = require('../models/lobby')
const getHighscore = require("../utils/scores")

module.exports = function(app) {
  // send high score here
  app.post('/', async (req, res) => {
    const player = req.body
    let leaderboard = await Leaderboard.findOne({})
    for (index in leaderboard.board) {
      if (leaderboard.board[index].score < player.score) {
        leaderboard.board.splice(index, 0, player)
        leaderboard.board.length = 100
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
    const context = {
      lobby: req.params.name,
      highscores: await getHighscore()
    }
    return res.render('multiplayer-form', {lobbyName: context.lobby, highscores: context.highscores})
  })

  app.post('/multiplayer/:name', async (req, res) => {
    const lobbyName = req.params.name
    const lobby = await Lobby.findOne({name: lobbyName})

    if (lobby && lobby.currentPlayers < lobby.totalPlayers) {
      const user = req.body.username
      lobby.currentPlayers += 1
      lobby.scores.push({
        user:user,
        score: -1
      })
      lobby.markModified("currentPlayers")
      lobby.markModified("scores")
      lobby.save()
      res.cookie("user", user)
      return res.redirect(`/multiplayer/${lobbyName}/game`)
    } else {
      const context = {
        lobby: req.params.name,
        highscores: await getHighscore()
      }
      return res.render(`multiplayer-form`, {lobbyName: context.lobby, highscores: context.highscores, errorMSG: true})
    }
  })

  app.get('/multiplayer/:name/game', async (req, res) => {
    const context = {
      highscores: await getHighscore()
    }
    return res.render("index", {highscores: context.highscores})
  })

  app.post('/multiplayer/:name/game', async (req, res) => {
    const lobbyName = req.params.name
    const lobby = await Lobby.findOne({name: lobbyName})
    const leaderboard = await Leaderboard.findOne({})
    const score = req.body.score
    const username = req.cookies.user

    if (username === "") {
      return res.redirect(`/multiplayer/${lobbyName}`)
    }

    if (leaderboard.board[99].score < score) {
      for (index in leaderboard.board) {
        if (leaderboard.board[index].score < score) {
          leaderboard.board.splice(index, 0, {
            name: username,
            score: score
          })
          leaderboard.board.length = 100
          leaderboard.markModified("board")
          break
        }
      }
      leaderboard.save()
    }

    for (index in lobby.scores) {
      if (lobby.scores[index].user === username) {
        lobby.scores[index].score = score
        lobby.scoredPlayers += 1
        lobby.markModified("score")
        lobby.markModified("scoredPlayers")
        if (lobby.scoredPlayers === lobby.totalPlayers) {
          lobby.isComplete = true
          lobby.markModified("isComplete")
        }
      }
    }
    lobby.save()
    return res.redirect(`/multiplayer/${lobbyName}/results`)
  })

  app.get('/multiplayer/:name/results', async (req, res) => {
    const lobbyName = req.params.name
    const lobby = await Lobby.findOne({name: lobbyName})

    let scoresDecreasing = []
    let flag = false;
    for (player of lobby.scores) {
      if (scoresDecreasing.length === 0) {
        scoresDecreasing.push(player)
      } else {
        for (i in scoresDecreasing) {
          if (scoresDecreasing[i].score < player.score) {
            scoresDecreasing.splice(i, 0, player)
            flag = true
          }
        }
        if (!flag) {
          scoresDecreasing.push(player)
        }
        flag = false
      }
    }
    console.log("WOOASGKNASKNG",scoresDecreasing)
    scoresDecreasing = scoresDecreasing.map((score, index)=> {
      const updated_scores = {}
      updated_scores.rank = index + 1
      updated_scores.user = score.user
      updated_scores.score = score.score
      return updated_scores
    })
    const context = {
      highscores: await getHighscore(),
      results: scoresDecreasing,
      isComplete: lobby.isComplete
    }
    if (lobby.isComplete) {
      context.winnerName = scoresDecreasing[0].user
      context.winnerScore = scoresDecreasing[0].score
    }
    res.cookie("user", "")
    return res.render("results", {
      highscores: context.highscores, 
      results: context.results, 
      winnerName: context.winnerName,
      winnerScore: context.winnerScore,
      isComplete: context.isComplete
    })
  })
}