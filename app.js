const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || '5000';
const cors = require('cors');

const app = express();
app.use(cors());

app
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use("/",require('./routes/index'));

var routes = ["oneDheros"];

routes.forEach((element) => {
    app.use("/" + element,require("./routes/" + element));
});

const http = require('http');
app.set('port',PORT);
const server = http.createServer(app);

require('./games/oneDheros').start();

require('./scripts/socketer').listen(server);

server.listen(PORT);

server.on('listening', () => {
    console.log(`Listening at port ${PORT}`);
});

