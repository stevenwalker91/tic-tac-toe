
//gameboard purpose is any functions or variables related to the physical gameboard
//this should not contain any logic that manupulates the UI, that should be seperated into a displayController (although gameboard may call on that external logic)
const Gameboard = (() => {
    let _gameBoard = [0,1,2,3,4,5,6,7,8];


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

    
    const clearBoard = () => {
        _gameBoard = [];
        //call display controller to reflect the change - perhaps call this seperately within gameController to avoid functions doing multiple things
    };



    return { 
        clearBoard,
        getGameBoard,
        getEmptySlots
    };
})();



const DisplayController = (() => {

    //listen for user inputs on gameBoard
    const gameBoard = document.getElementById('game-board');

    gameBoard.addEventListener('click', function(event) {
        const gameTile = event.target.dataset.id;
        console.log(GameController.getactivePlayer())

        console.log(gameTile);
        updateGameboardUI();
    })


    //update th UI with latest gameBoard when a move is made
    const updateGameboardUI = (player) => {

    };

})();

const Player = (name, symbol) => {
    const returnName = () => {
        console.log(`Hi my name is ${name}`)
    }
    return { name, symbol, returnName };
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
    function getactivePlayer()  {
        return _activePlayer;
    }

    //function to change the active player
    const switchPlayer = () => {
        if (_activePlayer == playerOne) {
            _activePlayer = playerTwo;
        } else; {
            _activePlayer = playerOne;
        }
    }

    console.log(playerTwo);
    console.log(Computer.isPrototypeOf(Player));
    playerTwo.returnName();



    //function to check if the game is won


    //function to check if the player move is valid

    return { getactivePlayer }
    

})();

const ComputerController = (() => {

    //is this needed or should instead sit as part of the player object, perhaps a prototype which inherits from player?

})();


