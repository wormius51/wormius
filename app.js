const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || '8000';
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(cors({
    origin: "https://game313569.konggames.com",
    optionsSuccessStatus: 200,
    credentials: true
}));

app
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));


function makeSecret(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

app.use(session({secret: makeSecret(20), resave: false, saveUninitialized: true, cookie: {secure: true}}));

app.use("/",require('./routes/index'));

const routes = ["games", "tutorials", "devlog", "oneDheros", 
"food-chain-game", "button-button-button","canvas-land", 
"king-of-the-tile", "tribute-chess"];

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

require('./scripts/socketer').listen(server);

server.listen(PORT);

server.on('listening', () => {
    console.log(`Listening at port ${PORT}`);
});

