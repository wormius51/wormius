const express = require('express');
const router = express.Router();

const Match = require('./match');
const Player = require('./player');

router.use('/createMatch', (req,res,next) => {
    let player = Player.getPlayerByID(req.body.sessionID);
    if (!player) {
        player = Player(req.session.id,req.session.nickName || 'Guest',
        req.body.colors, req.body.eyesStyles);
    }
    Player.updatePlayer(player, req);
    let match = Match([player]);
    if (req.body.privateMatch) {
        match.privateMatch = true;
    }
    res.send(Match.matchRes(match,player.sessionID));
});

router.use('/seekMatch', (req,res,next) => {
    let player = Player.getPlayerByID(req.body.sessionID);
    if (!player) {
        player = Player(req.session.id, req.session.nickName || 'Guest');
    }
    Player.updatePlayer(player, req);
    let match = null;
    if (req.body.privateMatch && req.body.matchID) {
        match = Match.joinMatchByID(req.body.matchID, player);
        if (!match) {
            res.send("No match with this ID");
            return;
        }
    } else if (!req.body.privateMatch) {
        match = Match.joinAvailable(player);
    }
    if (match) {
        let matchRes = Match.matchRes(match,player.sessionID);
        res.send(matchRes);
    } else {
        let match = Match([player]);
        if (req.body.privateMatch) {
            match.privateMatch = true;
        }
        res.send(Match.matchRes(match,player.sessionID));
    }
});


router.use('/stopSeek', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    if (match) {
        if (match.players.length < 2) {
            Match.remove(match.id);
            res.send('match removed');
        } else {
            res.send('match is ongoing');
        }
    } else {
        res.send("no match with this ID");
    }
});

router.use('/playMove', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    if (!req.body.move) {
        res.send({error : 'parameter \'move\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    match.moves.push(req.body.move);
    res.send('played move: ' + req.body.move);
});

router.use('/getMatch', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    if (match) {
        res.send(Match.matchRes(match,req.body.sessionID? req.body.sessionID : req.session.id));
    } else {
        res.send({error : 'no match'});
    }
});


router.use('/finishMatch', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    if (!match) {
        res.send('match is over');
        return;
    }
    if (match.finished) {
        Match.remove(req.body.matchID);
        res.send('removed match');
    } else {
        match.finished = true;
        res.send('set match to finish');
    }
});

router.use('/pingMatch' ,(req,res,next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    Match.myPlayerIndex(match,req.body.sessionID ? req.body.sessionID : req.session.id);
    res.send('ping');
});


module.exports = router;
module.exports.Match = Match;
module.exports.Player = Player;