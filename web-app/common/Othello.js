/**
 * @namespace Othello
 * @description Othello.js defines the gameplay, rules and conditions for the game Othello. This game module can be implemented with a HTML and CSS web-app interface.
 * @author Navyansh Malhotra
 * @version v1.0
 */

/**
 * A Board is an rectangular grid that tokens can be placed into one at a time.
 * Tokens fill up empty positions from the bottom of a column upwards.
 * It is implemented as an array of columns (rather than rows) of tokens
 * (or empty positions)
 * @memberof Othello
 * @typedef {Connect4.Token_or_empty[][]} Board
 */

/**
 * A token is a coloured disk that players place in the grid.
 * @memberof Othello
 * @typedef {(1 | 2)} Token
 */

/**
 * Either a token or an empty position.
 * @memberof Othello
 * @typedef {(Connect4.Token | 0)} Token_or_empty
 */

/**
 * A set of template token strings for {@link Connect4.to_string_with_tokens}.
 * @memberof Connect4
 * @enum {string[]}
 * @property {string[]} default ["0", "1", "2"] Displays tokens by their index.
 * @property {string[]} disks ["⚫", "🔴", "🟡"]
 * Displays tokens as coloured disks.
 * @property {string[]} zombies ["🟫", "🚧", "🧟"]
 * Displays tokens as zombies and barricades.
 */

/**
 * Impure Function.
 * Logs to the console a string representation of a board,
 * and returns that board.
 * @memberof Connect4
 * @function
 * @param {Connect4.board} board The board to represent.
 * @returns {Connect4.board} String representation.
 */

/**
 * Create a new empty board.
 * Optionally with a specified width and height,
 * otherwise returns a standard 7 wide, 6 high board.
 * @memberof Connect4
 * @function
 * @param {number} [width = 8] The width of the new board.
 * @param {number} [height = 8] The height of the new board.
 * @returns {Connect4.Board} An empty board for starting a game.
 */

/*jslint es6 */
/*jslint browser:true */
/*global window */

import R from "../common/ramda.js";

const Othello = Object.create(null);
const width = 8;
const height = 8;

Othello.token_strings = Object.freeze({
    "default": ["0", "1", "2"],
    "disks": ["", "⚫", "⚪"]
});

Othello.empty_board = function (width, height) {
    "use strict";
    return R.repeat(R.repeat(0, height), width);
};



Othello.setup_board = function(board){
    "use strict";
    board = Othello.place_token(1, 3, 4, board);
    board = Othello.place_token(1, 4, 3, board);
    board = Othello.place_token(2, 3, 3, board);
    board = Othello.place_token(2, 4, 4, board);
    return board;
};

Othello.place_token = function (player, column_index, row_index, board) {
    "use strict";
    return R.update(
        column_index,
        R.update(row_index, player, board[column_index]),
        board
    );
};


Othello.is_ended= function(board) {
    "use strict";
    return false;
};

Othello.size = function (board) {
    "use strict";
    return [board.length, board[0].length];
};

Othello.is_cell_empty = function (column_index, row_index, board) {
    "use strict";
    if (board[column_index][width - 1 - row_index] === 0) {
        return true;
    }
    else{
        return false;
    }
};

Othello.check_line = function (player, delta_column, delta_row, column_index, row_index, board){
    "use strict";
    if (board[column_index][row_index] === player){
        return true;
    }
    if (board[column_index][row_index] === 0){
        return false;
    }
    if ((row_index + delta_row < 0) || (row_index + delta_row > height - 1)){
        return false;
    }
    if ((column_index + delta_column < 0) || (column_index + delta_column > width - 1)){
        return false;
    }
    return (Othello.check_line(player, delta_column, delta_row, column_index + delta_column, row_index + delta_row, board));
};

Othello.adjacent_support = function(player, delta_column, delta_row, column_index, row_index, board){
    "use strict";
    let other_player = Othello.other_player(player);
    if ((row_index + delta_row < 0) || (row_index + delta_row > height - 1)){
        return false;
    }
    if ((column_index + delta_column < 0) || (column_index + delta_column > width - 1)){
        return false;
    }
    if (board[column_index+delta_column][row_index+delta_row] !== other_player){
        return false;
    }
    if ((row_index + delta_row + delta_row < 0) || (row_index + delta_row + delta_row > height - 1)){
        return false;
    }
    if ((column_index + delta_column + delta_column < 0) || (column_index + delta_column + delta_column > width - 1)){
        return false;
    }
    return Othello.check_line(player, delta_column, delta_row, column_index + delta_column + delta_column, row_index + delta_row + delta_row, board);
};

Othello.find_valid_moves = function(player, legal_moves_board, board){
    "use strict";
    legal_moves_board = Othello.empty_board(width, height);
    for (let row = 0; row < height; row++){
        for (let column = 0; column < width; column++){
            if (Othello.is_cell_empty(column, 7 - row, board)){
                let north = Othello.adjacent_support(player, 0, -1, column, row, board);
                let south = Othello.adjacent_support(player, 0, 1, column, row, board);
                let east = Othello.adjacent_support(player, 1, 0, column, row, board);
                let west = Othello.adjacent_support(player, -1, 0, column, row, board);
                let north_west = Othello.adjacent_support(player, -1, -1, column, row, board);
                let north_east = Othello.adjacent_support(player, 1, -1, column, row, board);
                let south_west = Othello.adjacent_support(player, -1, 1, column, row, board);
                let south_east = Othello.adjacent_support(player, 1, 1, column, row, board);
               if (north || south || east || west || north_east || north_west || south_east || south_west){
                    legal_moves_board = Othello.place_token(player, column, row, legal_moves_board);
                };
            };
        };
    };
    return legal_moves_board;
};

Othello.legal_moves_available = function(player, legal_moves_board){
    let available_moves = false;
    for (let row = 0; row < height; row++){
        for (let column = 0; column < width; column++){
            if (legal_moves_board[column][row] === player){
                available_moves = true;
            }
        }
    }
    return available_moves;
};

Othello.column_as_array = function (board, column_index) {
    const column = board[column_index];
    return column;
};

Othello.row_as_array = function (board, row_index) {
    const row = R.transpose(board)[row_index];
    return row;
};

Othello.other_player = function(player){
    if (player === 1){
        return 2;
    } else if (player === 2) {
        return 1;
    };
};

Othello.score = function(player, board){
    let score = 0;
    for (let i = 0; i< 8; i++){
        for (let j = 0; j < 8; j++){
            if (board[i][j] === player){
                score = score + 1;
            }
        };
    };
    return score;
};

Othello.game_over = function(no_legal_move_counter, board){
    if ((Othello.score(1, board) + Othello.score(2, board) === 64) || (no_legal_move_counter === 2) || (Othello.score(1, board) === 0) || (Othello.score(2, board) === 0)){
        return true;
    } else {
        return false;
    };
};

Othello.winner = function(board){
    if (Othello.score(1, board) > Othello.score(2, board)){
        return "Black";
    } else if (Othello.score(1, board) === Othello.score(2, board)){
        return "Tie"
    } else {
        return "White"
    }
};

Othello.random_legal_move = function(player, legal_moves_board){
    let legal_moves_array = [];
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (legal_moves_board[i][j] === player){
                legal_moves_array.push([i,j])
            }
        }
    }
    return legal_moves_array[Math.floor(Math.random() * legal_moves_array.length)];
}
export default Object.freeze(Othello);