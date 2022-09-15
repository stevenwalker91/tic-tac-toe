
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
        //empty slots are determined by having a number value (rather than a string symbol)
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

    const generateDumbMove = (player) => {
        const availableTiles = Gameboard.getEmptySlots();
        const numberOfTiles = availableTiles.length;
        const dumbSelection = Math.floor(Math.random() * numberOfTiles);
        return availableTiles[dumbSelection];
        //player.makeMove(availableTiles[dumbSelection]);

    }

    return Object.assign({},prototype,{ generateDumbMove })
};

const GameController = (() => {

    const _playerOne = Player('Steven', 'X');
    const _playerTwo = Computer('Bot', 'O');

    //also get the gameboard because it's used in several of the module functions
    const gameBoard = Gameboard.getGameBoard();

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
        //run loop twice so each player cna play
        for ( j = 0 ; j < 2; j++ ) {
            let tileSelection;

            //check which player is active; get the user play from event and the bot play from random generation
            if (_activePlayer == _playerOne) {
                tileSelection = event.target.dataset.id;
                console.log(tileSelection);
            } else {
                tileSelection = _playerTwo.generateDumbMove(_activePlayer);
                console.log(tileSelection);
            }

            //check that the move is actually allowed before playing it
            if (!_checkIfMoveIsLegal(tileSelection)) {
                console.log('illegal')
                return;
            };
            
            //satisfied the move is legal so allow the move to take place
            _activePlayer.makeMove(tileSelection);

            //check for win and stop the game if found
            if (_checkForWin(_activePlayer.symbol)) {
                console.log(`Game over. ${_activePlayer.name} wins`);
                return;
            }

            //switch the player before loop re-runs
            _switchPlayer();
        }
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


        //forEach doesn't work because it can't return mid flow, instead use a for loop to go through each set of
        // winning moves and check if any are shown on the gameboard. if the loop doesn't pick up a win the function returns false
        for ( i = 0; i < winningMoves.length; i++ ) {
            if (gameBoard[winningMoves[i][0]] == symbol && 
                gameBoard[winningMoves[i][1]] == symbol && 
                gameBoard[winningMoves[i][2]] == symbol) {

                return true;
            } 
        }

        return false;

    }
    
    const _checkIfMoveIsLegal = (index) => {
        const gameTile = parseInt(index);

        //replace this logic with instead calling the empty slots function and check the gameTile to see if it's there
        if (Number.isInteger(gameBoard[gameTile]) ) {
            //the field is empty and therefore a legal move
            return true
        }

    }
    return { getactivePlayer, playRound }   
})();



