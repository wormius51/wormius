const router = require('express').Router();

router.use('/session', require('./session'));
router.use('/match-making', require('./match-making'));

module.exports = router;