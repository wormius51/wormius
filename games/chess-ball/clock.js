
function Clock (whiteTime, blackTime, whiteIncrement, blackIncrement) {
    if (!whiteTime)
        whiteTime = 1000 * 60 * 3;
    if (!blackTime)
        blackTime = 1000 * 60 * 3;
    if (!whiteIncrement)
        whiteIncrement = 2000;
    if (!blackIncrement)
        blackIncrement = 2000;
    return {
        white: {
            startTime: whiteTime,
            timeAtStartOfMove: whiteTime, 
            time: whiteTime,
            increment: whiteIncrement
        },
        black: {
            startTime: blackTime,
            timeAtStartOfMove: blackTime, 
            time: blackTime,
            increment: blackIncrement
        },
        moveStartTimeStamp: 0,
        turn: "waiting"
    }
}

function startClock (clock, turn) {
    if (turn)
        clock.turn = turn;
    else
        clock.turn = (clock.turn == "white") ? "black" : "white";
    clock.moveStartTimeStamp = Date.now();
    clock.white.time = clock.white.startTime;
    clock.black.time = clock.black.startTime;
    clock.white.timeAtStartOfMove = clock.white.startTime;
    clock.black.timeAtStartOfMove = clock.black.startTime;
}

function pushClock (clock) {
    updateClock(clock);
    clock[clock.turn].time += clock[clock.turn].increment;
    clock[clock.turn].timeAtStartOfMove = clock[clock.turn].time;
    clock.turn = (clock.turn == "white") ? "black" : "white";
    clock.moveStartTimeStamp = Date.now();
}

function updateClock (clock) {
    if (clock.turn == "waiting")
        return;
    const moveTime = Date.now() - clock.moveStartTimeStamp;
    clock[clock.turn].time = clock[clock.turn].timeAtStartOfMove - moveTime;
}

module.exports = Clock;
module.exports.startClock = startClock;
module.exports.pushClock = pushClock;
module.exports.updateClock = updateClock;