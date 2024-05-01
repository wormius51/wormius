const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || '8000';
const cors = require('cors');
//const session = require('express-session');
const session = require('cookie-session');
const WebSocketServer = require('ws').Server;

const app = express();

var whitelist = ['https://wormius.herokuapp.com','https://game313569.konggames.com', 'https://game313569.konggames.com','https://v6p9d9t4.ssl.hwcdn.net']
if (!process.env.PORT) {
  whitelist.push('http://localhost:8000');
  whitelist.push('http://localhost:3000');
}
var corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
app.use(cors(corsOptions));

app
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(function(req, res, next) {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

function makeSecret(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

app.use(session({secret: makeSecret(20), resave: false, saveUninitialized: true, 
  /*cookie: { secure: app.get('env') === 'production' }, 
  proxy: app.get('env') === 'production'*/
  cookie: {secureProxy: true}
}));

app.use("/",require('./routes/index'));

const routes = [
  "games", "tutorials", "devlog", "oneDheros", 
  "food-chain-game", "button-button-button","canvas-land", 
  "king-of-the-tile", "tribute-chess", "wheel", "chess-ball",
  "worm", "blog", "privacy-policy", "terms", "bmc", "tools",
  "creatures-of-energy"
];

routes.forEach((element) => {
    app.use("/" + element,require("./routes/" + element));
});

app.use("/kongregate-test",require('./routes/kongregate-test'));

const http = require('http');
app.set('port',PORT);
const server = http.createServer(app);

require('./games/oneDheros').start();
require('./games/food-chain-game').start();
require('./games/button-button-button').start();
require('./games/canvas-land').start();
require('./games/king-of-the-tile').start();
require('./games/wheel').start();
require('./games/chess-ball').start();


require('./scripts/socketer').listen(server);

server.listen(PORT);

server.on('listening', () => {
    console.log(`Listening at port ${PORT}`);
});

require('./scripts/db-client').setup();

const wss = new WebSocketServer({server: server});

class SocketEventData {
  /**
   * 
   * @param {String} evenName 
   * @param {Any} message 
   */
  constructor (evenName, message = "") {
      this.EventName = evenName;
      if (typeof message === "string")
          this.Message = message;
      else
          this.Message = JSON.stringify(message);
  }
}


wss.on('connection', socket => {
  console.log("connected socket");
  let greeting = new SocketEventData("connection", "Hello");
  socket.send(JSON.stringify(greeting));
  socket.on('message', data => {
    console.log(data);
      try {
          let dataString = dataToString(data);
          console.log(dataString);
          let socketEventData = JSON.parse(dataString);
          matchMaker.socketMessageHandler(socketEventData, socket);
      } catch (err) {
          console.error(err);
      }
  });
  socket.on('close', data => {
      console.log("disconnected socket with code: " + data);
      let fairwell = stringToBytes("goodbye");
      fairwell.unshift(0);
      socket.send(fairwell);
  });

  socket.on('error', data => {
      console.log(data);
  });
});


function stringToBytes (string) {
  let bytes = [];
  for (let i = 0; i < string.length; i++)
      bytes.push(string.charCodeAt(i));
  return bytes;
}

function dataToString (data) {
  let s = "";
  data.forEach(byte => {
      s += String.fromCharCode(byte);
  });
  return s;
}