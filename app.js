const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || '8000';
const cors = require('cors');

const app = express();
app.use(cors());

app
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use("/",require('./routes/index'));

const routes = ["games", "tutorials", "oneDheros", "food-chain-game", "button-button-button","canvas-land"];

routes.forEach((element) => {
    app.use("/" + element,require("./routes/" + element));
});

//app.use("/kongregate-test",require('./routes/kongregate-test'));

const http = require('http');
app.set('port',PORT);
const server = http.createServer(app);

require('./games/oneDheros').start();
require('./games/food-chain-game').start();
require('./games/button-button-button').start();
require('./games/canvas-land').start();

require('./scripts/socketer').listen(server);

server.listen(PORT);

server.on('listening', () => {
    console.log(`Listening at port ${PORT}`);
});

