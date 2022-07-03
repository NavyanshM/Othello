/**
 * @namespace Othello
 * @description Othello.js defines the gameplay, rules and conditions for the game Othello. This game module can be implemented with a HTML and CSS web-app interface. 
 * @author Navyansh Malhotra
 * @version v1.0
 */

import R from "../common/ramda.js";

const Othello = Object.create(null);
const width = 8;
const height = 8;

Othello.token_strings = Object.freeze({
    "default": ["0", "1", "2"],
    "disks": ["", "⚪", "⚫"]
});

Othello.empty_board = function (width, height) {
    return R.repeat(R.repeat(0, height), width);
};


//https://www.youtube.com/watch?v=XseyfdrHmoY&list=PLA7VQFdAJ2vfytZFoskFIBYLlNuCUGi0N&index=7&ab_channel=Mr.Soderquist
//https://www.youtube.com/watch?v=_7Jz4MbAjCE&ab_channel=djp3


Othello.setup_board = function(board){
    board = Othello.place_token(1, 3, 4, board);
    board = Othello.place_token(1, 4, 3, board);
    board = Othello.place_token(2, 3, 3, board);
    board = Othello.place_token(2, 4, 4, board);
    return board;
};

//if (board[3][4] === 1){
//board = Othello.place_token(2, 0, 0, board);
//};

Othello.player_to_ply = function (board) {
    const flattened_board = R.flatten(board);
    return (
        R.count(
            R.equals(1),
            flattened_board
        ) === R.count(
            R.equals(2),
            flattened_board
        )
            ? 1
            : 2
    );
};

Othello.place_token = function (player, column_index, row_index, board) {
    return R.update(
        column_index,
        R.update(7 - row_index, player, board[column_index]),
        board
    );
};


Othello.is_ended= function(board) {
    return false;
}

Othello.size = function (board) {
    return [board.length, board[0].length];
};

Othello.is_cell_empty = function (column_index, row_index, board) {
    if (board[column_index][width - 1 - row_index] === 0) {
        return true;
    }
    else{
        return false;
    }
};


Othello.valid_move_available = function (player, column_index, row_index, board) {
    if (Othello.north(player, column_index, row_index, board) && Othello.is_cell_empty(column_index, row_index, board)) {
        return true; 
    }
};

//checks only one on top
/* Othello.north = function (player, column_index, row_index, board) { 
    if ((height - row_index < height) && (board[column_index][height - row_index ] === Othello.other_player(player))){
        return true;
    };
}; 
 */

Othello.north = function (player, column_index, row_index, board) { 
    if ((height - row_index < height) && (Othello.column_as_array(board, column_index).includes(player, height - row_index + 1)) && (board[column_index][height - row_index ] === Othello.other_player(player))){
        return true;
    };
}; 

Othello.column_as_array = function (board, column_index) {
    let column = [];
    for (let i = 0; i < height; i++) {
        column.push(board[column_index][i]);
    };
    //column = R.reverse(column); 
    return column;
};

Othello.other_player = function(player){
    if (player === 1){
        return 2;
    } else if (player === 2) {
        return 1;
    };
};

export default Object.freeze(Othello);