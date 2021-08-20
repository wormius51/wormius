const resultText = document.getElementById("resaltText");
const title = document.querySelector("title");
function updateInfo () {
    title.innerHTML = "Chess Ball";
    switch (positionResult(position)) {
        case "playing":
            resultText.innerHTML = position.turn == "white" ? "White to move" : "Black to move";
            if (matchData) 
                title.innerHTML = position.turn == myColor ? "Your turn" : "Opponents turn";
            break;
        case "goal white":
            resultText.innerHTML = "White wins by goal";
            break;
        case "goal black":
            resultText.innerHTML = "Black wins by goal";
            break;
        case "mate white":
            resultText.innerHTML = "White wins by checkmate";
            break;
        case "mate black":
            resultText.innerHTML = "Black wins by checkmate";
            break;
        case "stalemate":
            resultText.innerHTML = "Draw by stalemate";
            break;
    }
}