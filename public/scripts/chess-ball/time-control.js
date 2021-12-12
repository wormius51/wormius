const timeControlSpan = document.getElementById("timeControlSpan");
const timeSlider = document.getElementById("timeSlider");
const incrementSlider = document.getElementById("incrementSlider");

let timeControl = {
    time: 3 * 60 * 1000,
    increment: 2000
};

window.addEventListener('load', () => {
    moveSliders();
    updateTimeControl();
});

timeSlider.addEventListener('mousemove', updateTimeControl);
incrementSlider.addEventListener('mousemove', updateTimeControl);
timeSlider.addEventListener('touchmove', updateTimeControl);
incrementSlider.addEventListener('touchmove', updateTimeControl);

function moveSliders () {
    timeSlider.value = timeControl.time / 15000;
    incrementSlider.value = timeControl.increment / 1000;
}

function updateTimeControl () {
    timeControl.time = timeSlider.value * 15000;
    timeControl.increment = incrementSlider.value * 1000;
    timeControlSpan.innerHTML = `${millisecondsToTimeString(timeControl.time)} + ${millisecondsToTimeString(timeControl.increment)}`;
    socket.emit('update-time-control', timeControl);
}

function Clock (whiteTime, blackTime, whiteIncrement, blackIncrement) {
    if (!whiteTime)
        whiteTime = 1000 * 60 * 3;
    if (!blackTime)
        blackTime = 1000 * 60 * 3;
    if (!whiteIncrement)
        whiteIncrement = 0;
    if (!blackIncrement)
        blackIncrement = 0;
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

function resetClock (clock) {
    clock.white.time = clock.white.startTime;
    clock.black.time = clock.black.startTime;
    clock.white.timeAtStartOfMove = clock.white.startTime;
    clock.black.timeAtStartOfMove = clock.black.startTime;
    clock.turn = "waiting";
}

function millisecondsToTime (milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    milliseconds -= seconds * 1000;
    let tenthSeconds = Math.floor(milliseconds / 100);
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    let hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
    return {
        tenthSeconds: tenthSeconds,
        seconds: seconds,
        minutes: minutes,
        hours: hours
    };
}

function millisecondsToTimeString (milliseconds) {
    if (milliseconds <= 0)
        return "00:00:0";
    const time = millisecondsToTime(milliseconds);
    let timeString = "";
    if (time.hours == 0 && time.minutes == 0 && time.seconds < 10)
        timeString = ":" + time.tenthSeconds;
    if (time.minutes < 10)
        time.minutes = "0" + time.minutes;
    if (time.seconds < 10)
        time.seconds = "0" + time.seconds;
    timeString = `${time.minutes}:${time.seconds}` + timeString;
    if (time.hours > 0) {
        if (time.hours < 10)
            time.hours = "0" + time.hours;
        timeString = `${time.hours}:${timeString}`;
    }
    return timeString;
}

let clock = Clock();