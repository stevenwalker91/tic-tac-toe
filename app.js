
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
        _gameBoard = [0,1,2,3,4,5,6,7,8];
        //call display controller to reflect the change - perhaps call this seperately within gameController to avoid functions doing multiple things
    };

    return { 
        clearBoard,
        getGameBoard,
        getEmptySlots,
        updateGameboard
    };
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

    const generateDumbMove = () => {
        //get the empty slots and then use math random to select one of the free ones
        const availableTiles = Gameboard.getEmptySlots();
        const numberOfTiles = availableTiles.length;
        const dumbSelection = Math.floor(Math.random() * numberOfTiles);
        return availableTiles[dumbSelection];
    }

    return Object.assign({},prototype,{ generateDumbMove })
};


const GameController = (() => {


    const _playerOne = Player('Player 1', 'X');
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

        //if the player has submitted a name, update the player object with it, otherwise leave it as player 1
        //the problem with this is it runs every round, need a smarter way to do i for the game
        const playerName = DisplayController.getUIUser();
        if(playerName !== ''){
            _playerOne.name = playerName;
        }
        //run loop twice so each player can play
        for ( let i = 0 ; i < 2; i++ ) {
            let tileSelection;

            //check which player is active; get the user play from event and the bot play from random generation
            if (_activePlayer == _playerOne) {
                tileSelection = event.target.dataset.id;
            } else {
                tileSelection = _playerTwo.generateDumbMove();
            }

            //check that the move is actually allowed before playing it
            if (!_checkIfMoveIsLegal(tileSelection)) {
                return;
            };
            
            //satisfied the move is legal so allow the move to take place
            _activePlayer.makeMove(tileSelection);

            //check for win and stop the game if found
            if (_checkForWin(_activePlayer.symbol)) {
                _handleWin();
                break
            }

            //finally check for a draw and stop the game if won
            if (_checkForDraw()) {
                _handleDraw();
            };

            //switch the player before loop re-runs
            _switchPlayer();
        }
    };

    const _checkIfMoveIsLegal = (index) => {
        const gameBoard = Gameboard.getGameBoard();
        const gameTile = parseInt(index);

        //replace this logic with instead calling the empty slots function and check the gameTile to see if it's there
        if (Number.isInteger(gameBoard[gameTile]) ) {
            //the field is empty and therefore a legal move
            return true
        }

    }

    const _checkForWin = (symbol) => {
        const gameBoard = Gameboard.getGameBoard();
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
                    console.log(`${gameBoard[winningMoves[i][0]]} ${gameBoard[winningMoves[i][1]]} ${gameBoard[winningMoves[i][0]]}`)
                return true;
            } 
        }
        return false;
    }

    const _checkForDraw = () => {
        emptySlots = Gameboard.getEmptySlots();
        if (emptySlots.length === 0 ) {
            return true;
        }
    }

    const _handleWin = () => {
        //output win to the UI
        DisplayController.updateResults(_activePlayer.name, 'win');
        //lock inputs so player can't keep clicking
        DisplayController.removeEventListener();
        DisplayController.disableControls();
        return;
    }

    const _handleDraw = () => {
        //output draw to the UI
        DisplayController.updateResults(_activePlayer.name, 'draw');
        //lock inputs so player can't keep clicking
        DisplayController.removeEventListener();
        DisplayController.disableControls();
        return;
    }

    const restartGame = () => {
        //don't allow the game unless the player name is filled in
        const playerName = DisplayController.getUIUser();
        if(playerName === ''){
            return;
        }
        
        //different functions needed to restart the game and refresh the UI
        const gameBoard = Gameboard.getGameBoard();
        Gameboard.clearBoard();
        DisplayController.clearGameBoard();
        DisplayController.enableControls();
        DisplayController.addEventListener();   
        DisplayController.clearResults();
    }
    

    return { 
        getactivePlayer, 
        playRound,
        restartGame
    }   
})();



const DisplayController = (() => {

    //listen for user inputs on gameBoard
    const _gameBoardUI = document.getElementById('game-board');
    const _boardSquares = document.querySelectorAll('.game-board-space');
    const _results = document.getElementById('result-container');
    const _restartBtn =  document.getElementById('new-game');
    const _startBtn = document.getElementById('enter-name');

    //add this as a function so we can recall it later after we've removed it
    const addEventListener = () => {
        _gameBoardUI.addEventListener('click', GameController.playRound);

    }
    
    const removeEventListener = () => {
        _gameBoardUI.removeEventListener('click', GameController.playRound);
    }

    _restartBtn.addEventListener('click', GameController.restartGame);
    _startBtn.addEventListener('click', GameController.restartGame);

    //update th UI with latest gameBoard when a move is made
    const updateGameboardUI = (index, symbol) => {
        const element = document.getElementById(`board-space-${index}`)
        element.innerHTML = symbol;
    };

    const getUIUser = () => {
        const inputField = document.getElementById('user-name');
        return inputField.value;
    }
    const updateResults = (player, updateType) => {
        if (updateType === 'win') {
            _results.innerHTML = `Game Over. ${player} wins!`;
        } else {
            _results.innerHTML = `Game Over. It was a draw.`;
        }
        
    }

    const clearResults = () => {
        _results.innerHTML = ``;
    }

    const disableControls = () => {
        _boardSquares.forEach(square => {
            square.classList.add('disabled');
        })
    }

    const enableControls = () => {
        _boardSquares.forEach(square => {
            square.classList.remove('disabled');
        })
    }

    const clearGameBoard = () => {
        _boardSquares.forEach(square => {
            square.innerHTML = '';
        })
    }

    return {
        updateGameboardUI,
        updateResults,
        removeEventListener,
        addEventListener,
        disableControls,
        enableControls,
        clearResults,
        clearGameBoard,
        getUIUser
    }
})();



