
//gameboard purpose is any functions or variables related to the physical gameboard
//this should not contain any logic that manupulates the UI, that should be seperated into a displayController (although gameboard may call on that external logic)
const Gameboard = (() => {
    let _gameBoard = ['','','','','','','','',''];
    /***** GETTERS *****/ 

    //returning the gameBoard array directly doesn't work because the return object retains the original value
    //so instead expose a function so it can change dynamically
    const getGameBoard = () =>  {
        return _gameBoard;
    }

    //function to check for empty gameBoard slots
    const getEmptySlots = () => {
        const emptySlots = [];
        return emptySlots;
    }

    /***** SETTERS *****/ 

    const updateGameboard = (index, symbol) => {
        _gameBoard[index] = symbol;
        console.log(_gameBoard);
    }
    
    const clearBoard = () => {
        _gameBoard = [];
        //call display controller to reflect the change - perhaps call this seperately within gameController to avoid functions doing multiple things
    };


    return { 
        clearBoard,
        getGameBoard,
        getEmptySlots,
        updateGameboard
    };
})();



const DisplayController = (() => {

    //listen for user inputs on gameBoard
    const gameBoard = document.getElementById('game-board');

    gameBoard.addEventListener('click', function(event) {
       
        //check that it's a legal move
        if (GameController.checkIfMoveIsLegal(event)) {
            GameController.playRound(event);
        }

        
    });


    //update th UI with latest gameBoard when a move is made
    const updateGameboardUI = (index, symbol) => {
        const element = document.getElementById(`board-space-${index}`)
        element.innerHTML = symbol;

    };

    return {
        updateGameboardUI
    }

})();



const Player = (name, symbol) => {
    const makeMove = (index) => {
        //first pass the submission to the gameboard and then update the UI
        Gameboard.updateGameboard(index, symbol);
        DisplayController.updateGameboardUI(index, symbol);

    }

    return { name, symbol, makeMove };
};



//create computer as prototype of player so it can inherit functions and then create computer specific stuff
const Computer = (name, symbol) => {    
    const prototype = Player(name,symbol)
    const returnVals = {}
    return Object.assign({},prototype,returnVals)
};

const GameController = (() => {

    const playerOne = Player('Steven', 'X');
    const playerTwo = Computer('Bot', 'O');

    let _activePlayer = playerOne;

    //expose the activeplayer
    const getactivePlayer = () => {
        return _activePlayer;
    }

    //function to change the active player
    const switchPlayer = () => {
        if (_activePlayer == playerOne) {
            _activePlayer = playerTwo;
        } else {
            _activePlayer = playerOne;
        }
    }

    const playRound = (event) => {
        const gameTile = parseInt(event.target.dataset.id);
        _activePlayer.makeMove(gameTile);
    };

    const checkForWin = () => {
        const winningMoves = [];

    }
    

    const checkIfMoveIsLegal = (event) => {
        const gameTile = parseInt(event.target.dataset.id);
        const gameBoardValues = Gameboard.getGameBoard();

        if (gameBoardValues[gameTile] == '' ) {
            //the field is empty and therefore a legal move
            return true
        }

    }

    //function to check if the game is won


    //function to check if the player move is valid

    return { getactivePlayer, playRound, checkIfMoveIsLegal }
    

})();



