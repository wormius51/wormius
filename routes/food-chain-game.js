const router = require('express').Router();
const Species = require('../games/food-chain-game/species');

require('../games/food-chain-game/interaction').start();

router.get('/',(req, res, next) => {
    res.render('food-chain-game');
});

router.get('getSpeciess', (req, res, next) => {
    res.send(Species.speciess);
});

router.get('/getFoodChains', (req, res, next) => {
    res.send(Species.foodChains);
});

module.exports = router;