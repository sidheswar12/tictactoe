var roomCode = document.getElementById("game_board").getAttribute("play_room");
var char_choice = document.getElementById("game_board").getAttribute("char_choice");

var connectionString = 'ws://' + window.location.host + '/ws/play/' + roomCode + '/';
var gameSocket = new WebSocket(connectionString);
var gameBoard = [
    -1, -1, -1,
    -1, -1, -1,
    -1, -1, -1,
];
winIndices = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

var top_scorer = {
    "X": 0,
    "O": 0
};

let moveCount = 0;
let myturn = true;

let elementArray = document.getElementsByClassName('square');
for (var i = 0; i < elementArray.length; i++){
    elementArray[i].addEventListener("click", event=>{
        const index = event.path[0].getAttribute('data-index');
        if(gameBoard[index] == -1){
            if(!myturn){
                alert("Wait for other to place the move")
            }
            else{
                myturn = false;
                document.getElementById("move_alert").style.display = 'none';          
                make_move(index, char_choice);
            }
        }
    })
}

function make_move(index, player){
    index = parseInt(index);
    let data = {
        "event": "MOVE",
        "message": {
            "index": index,
            "player": player
        }
    }
    
    if(gameBoard[index] == -1){
        moveCount++;
        if(player == 'X')
            gameBoard[index] = 1;
        else if(player == 'O')
            gameBoard[index] = 0;
        else{
            alert("Invalid character choice");
            return false;
        }
        gameSocket.send(JSON.stringify(data))
    }
    
    elementArray[index].innerHTML = player;
    const win = checkWinner();
    if(myturn){
        if(win){
            data = {
                "event": "END",
                "message": `${player} is a winner. Play again?`
            }
            gameSocket.send(JSON.stringify(data))                       
            ++top_scorer[player];
            //TODO: storeResultToDB();     
        }
        else if(!win && moveCount == 9){
            data = {
                "event": "END",
                "message": "It's a draw. Play again?"
            }
            gameSocket.send(JSON.stringify(data))
        }
    }
}

function storeResultToDB(){
    //TODO: Store result to DB
}

function readResultFromDB(){
    //TODO: Store result from DB
}

function getTopScorerList(){ 
    //TODO: Need to remove the dictionary as defined in global section       
    var top_scorer = {
        "X": 5,
        "O": 1
    };
    //TODO: readResultFromDB()
    document.getElementById("btn").innerHTML = String("Score:: Player X : " + top_scorer['X'] + " & " + " Player O : " + top_scorer['O']);    
}

function reset(){
    gameBoard = [
        -1, -1, -1,
        -1, -1, -1,
        -1, -1, -1,
    ]; 
    moveCount = 0;
    myturn = true;
    document.getElementById("move_alert").style.display = 'inline';        
    for (var i = 0; i < elementArray.length; i++){
        elementArray[i].innerHTML = "";
    }
}

const check = (winIndex) => {
    if (
      gameBoard[winIndex[0]] !== -1 &&
      gameBoard[winIndex[0]] === gameBoard[winIndex[1]] &&
      gameBoard[winIndex[0]] === gameBoard[winIndex[2]]
    )   return true;
    return false;
};

function checkWinner(){
    let win = false;
    if (moveCount >= 5) {
      winIndices.forEach((w) => {
        if (check(w)) {
          win = true;
          windex = w;
        }
      });
    }
    return win;
}

function connect() {
    gameSocket.onopen = function open() {
        console.log('WebSockets connection created.');
        gameSocket.send(JSON.stringify({
            "event": "START",
            "message": ""
        }));
    };

    gameSocket.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };    
    gameSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        data = data["payload"];
        let message = data['message'];
        let event = data["event"];
        switch (event) {
            case "START":
                reset();
                break;
            case "END":
                alert(message);
                reset();
                break;
            case "MOVE":
                if(message["player"] != char_choice){
                    make_move(message["index"], message["player"])
                    myturn = true;
                    document.getElementById("move_alert").style.display = 'inline';        
                }
                break;
            default:
                console.log("No event")
        }
    };

    if (gameSocket.readyState == WebSocket.OPEN) {
        gameSocket.onopen();
    }
}

connect();
