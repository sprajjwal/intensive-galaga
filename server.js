const express = require('express')
const app = express()
const port = 3000
const Leaderboard = require('./models/leaderboard')
// require('dotenv').config();
// const path = require('path')

const handlebars = require('express-handlebars')
  .create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        }
    }
  });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const getHighscores = require('./utils/scores')
app.use(express.static("public")); // enables supplying static files

// Add after body parser initialization!
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// enable JWT
app.use(cookieParser());

app.get('/', async (req, res) => {
  const highscores = await Leaderboard.findOne({})
  const context = {
    highscores: await getHighscores()
  }
  res.render('index', {highscores: context.highscores})
})

// Defining leaderboard
// let new_score = new Leaderboard()
// new_score.size = 0
// new_score.board = Array(100)
// for (let i = 0; i < 100; i++) {
//   new_score.board[i] = {
//     name: `Player${i+1}`,
//     score: 100-i
//   }
// }
// new_score.save()

require('./data/galaga-db');
require("./controllers/multiplayer")(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app;