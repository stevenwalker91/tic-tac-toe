
//gameboard purpose is any functions or variables related to the physical gameboard
//this should not contain any logic that manupulates the UI, that should be seperated into a displayController (although gameboard may call on that external logic)
const Gameboard = (() => {
    let _gameBoard = [0,1,2,3,4,5,6,7,8];

    //returning the gameBoard array directly doesn't work because the return object retains the original value
    //so instead expose a function so it can change dynamically
    const getGameBoard = () =>  {
        return _gameBoard;
    }

    //function to check for empty gameBoard slots
    const getEmptySlots = () => {
        const emptySlots = _gameBoard.filter(board => Number.isInteger(board));
        return emptySlots;
    }

    const updateGameboard = (index, symbol) => {
        _gameBoard[index] = symbol;

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



//display controller is 
const DisplayController = (() => {

    //listen for user inputs on gameBoard
    const gameBoard = document.getElementById('game-board');

    gameBoard.addEventListener('click', function(event) {
       GameController.playRound(event);
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
        _moveCount ++;
    }

    let _moveCount = 0;

    return { name, symbol, makeMove };
};



//create computer as prototype of player so it can inherit functions and then create computer specific stuff
const Computer = (name, symbol) => {    
    const prototype = Player(name,symbol)

    const makeDumbMove = (player) => {
        const availableTiles = Gameboard.getEmptySlots();
        const numberOfTiles = availableTiles.length;
        const dumbSelection = Math.floor(Math.random() * numberOfTiles);

        player.makeMove(availableTiles[dumbSelection]);

    }

    return Object.assign({},prototype,{ makeDumbMove })
};

const GameController = (() => {

    const _playerOne = Player('Steven', 'X');
    const _playerTwo = Computer('Bot', 'O');

    let _activePlayer = _playerOne;

    //expose the activeplayer
    const getactivePlayer = () => {
        return _activePlayer;
    }

    //function to change the active player
    const _switchPlayer = () => {
        if (_activePlayer == _playerOne) {
            _activePlayer = _playerTwo;
        } else {
            _activePlayer = _playerOne;
        }
    }

    const playRound = (event) => {
        //first check if the move is legal, otherwise do nothing else
        if (!_checkIfMoveIsLegal(event)) {
            return;
        }

        //get selected tile from event and then let the player make their move
        const gameTile = parseInt(event.target.dataset.id);
        _activePlayer.makeMove(gameTile);

        //check if the user has won
        let _wonGame = _checkForWin(_activePlayer.symbol);
        console.log(_wonGame) 

        console.log(_checkForWin(_activePlayer.symbol));

        //joeyd up stuff here to do computer stuff - need to look at how this can better be done
        _switchPlayer();
        _playerTwo.makeDumbMove(_activePlayer);
    
        _switchPlayer();
        _checkForWin(_activePlayer.symbol);

    };

    const _checkForWin = (symbol) => {
        const winningMoves = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        const gameBoard = Gameboard.getGameBoard();
        //rather than checking every single time, we should also consider checking how many moves have been made
        //and only call the function if enough moves for a win have been made

        //for each loop cannot return during loop so this doesn't give the expected behaviour
        //need to replace this with a standard loop so we can return when a winning value is found
        winningMoves.forEach(array => {
            
            if(gameBoard[array[0]] == symbol && gameBoard[array[1]] == symbol & gameBoard[array[2]] == symbol) {
                console.log('win');
                return true;
            } else {
                return false;
            }
        })

    }
    

    const _checkIfMoveIsLegal = (event) => {
        const gameTile = parseInt(event.target.dataset.id);
        const gameBoardValues = Gameboard.getGameBoard();

        if (Number.isInteger(gameBoardValues[gameTile]) ) {
            //the field is empty and therefore a legal move
            return true
        }

    }


    return { getactivePlayer, playRound }
    

})();



