const  Gameboard = (() => {
    let _gameBoard = [
        [ 1, 2, 3],
        [ 4, 5, 6],
        [ 7, 8, 9]
    ];


    //returning the gameBoard array directly doesn't work because the return object retains the original value
    //so instead expose a function so it can change dynamically
    function getGameBoard()  {
        return _gameBoard;
    }

    //clearBoard function
    const clearBoard = () => {
        _gameBoard = [];
    };

    return { 
        clearBoard,
        getGameBoard
    };
})();

let gameBoard = Gameboard.getGameBoard

let array = Gameboard.getGameBoard();
console.log(array);
Gameboard.clearBoard();
 array = Gameboard.getGameBoard();
console.log(array);

const DisplayController = (() => {

})();

const Player = (name, symbol) => {

    return { name, symbol };
};

const GameController = (() => {

})();


