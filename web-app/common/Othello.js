/**
 * @namespace Othello
   @description Othello.js defines the gameplay, rules and conditions for the game Othello. This game module can be implemented with a HTML and CSS web-app interface
 * @author Navyansh Malhotra
 * @version v1.0
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

/**
 * Returns a {@link Othello.to_string} like function, mapping tokens to given string representations
 * @memberof Othello
 * @function
 * @param {string[]} token_strings
 * @returns {function} The string representation of the board
 */
 Othello.to_string_with_tokens = (token_strings) => (board) => R.pipe(
    R.transpose,
    R.reverse,
    replace_tokens_on_board(token_strings),
    R.map(R.join(" ")),
    R.join("\n")
)(board);

/**
 * Returns a string representation of the board
 * @memberof Othello
 * @function
 * @param {board} board The board to be represented
 * @returns {string} The string representation of the board
 */
 Othello.to_string = Othello.to_string_with_tokens(["0", "1", "2"]);


/**
 * Create a new empty board, represented as an array of arrays (2D array)
 * @memberof Othello
 * @function
 * @param {number} [width] The width of the new board
 * @param {number} [height] The height of the new board
 * @returns {board} An empty board for starting a game or to hold legal moves
 */
Othello.empty_board = function (width, height) {
    "use strict";
    return R.repeat(R.repeat(0, height), width);
};

/**
 * Places a token in a given position
 * @memberof Othello
 * @function
 * @param {number} player The new value to be pushed into the array
 * @param {number} column_index Array column to be updated
 * @param {number} row_index Array row to be updatd
 * @param {number[][]} board Original state of the board, to be updated
 * @returns {board} Returns the new state of the board.
 */
Othello.place_token = function (player, column_index, row_index, board) {
    "use strict";
    return R.update(
        column_index,
        R.update(row_index, player, board[column_index]),
        board
    );
};

/**
 * Places the initial 4 tokens as per the rules of Othello
 * @memberof Othello
 * @function
 * @param {number[][]} board The empty board
 * @returns {board} An updated board with 4 tokens placed; 2 white and 2 black.
 */
 Othello.setup_board = function(board){
    "use strict";
    board = Othello.place_token(1, 3, 4, board);
    board = Othello.place_token(1, 4, 3, board);
    board = Othello.place_token(2, 3, 3, board);
    board = Othello.place_token(2, 4, 4, board);
    return board;
};

/**
 * Checks if a cell is empty
 * @memberof Othello
 * @function
 * @param {number} column_index The column to be checked
 * @param {number[][]} row_index The row to be checked
 * @returns {(true | false)} True if index is empty (i.e = 0) else False
 */
Othello.is_cell_empty = function (column_index, row_index, board) {
    "use strict";
    if (board[column_index][width - 1 - row_index] === 0) {
        return true;
    }
    else{
        return false;
    }
};

/**
 * Recursive function to check if a token bounds a series of the other player's tokens, with it's own colour on the other side
 * @memberof Othello
 * @function
 * @param {number} player Player which is placing the new token, either 1 (Black) or 2 (White)
 * @param {number} delta_column Defines the column direction to be checked
 * @param {number} delta_row Defines the row direction to be checked
 * @param {number} column_index Defines the column where the new token is being placed
 * @param {number} row_index Defines the row where the new token is being placed
 * @param {number[][]} board The original state of the board, before the new token has been placed
 * @returns {(true | false)} True if the next element (as per delta_column and delta_row) is the same value as player
 */
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

/**
 * Function which provides iterative element indices to the check_line function
 * @memberof Othello
 * @function
 * @param {number} player Player which is placing the new token, either 1 (Black) or 2 (White)
 * @param {number} delta_column Defines the column direction to be checked
 * @param {number} delta_row Defines the row direction to be checked
 * @param {number} column_index Defines the column where the new token is being placed
 * @param {number} row_index Defines the row where the new token is being placed
 * @param {number[][]} board The original state of the board, before the new token has been placed
 * @returns {(true | false)} Boolean value determined by the return value of the check_line function
 */
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

/**
 * Function which updates the legal move board with all the legal moves available, for the player, based on the current state of the board
 * @memberof Othello
 * @function
 * @param {number} player Player, either 1 (Black) or 2 (White)
 * @param {number[][]} legal_moves_board The current legal moves board
 * @param {number[][]} board The current state of the game board
 * @returns {number[][]} The updated legal moves board
 */
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

/**
 * Function which updates the legal move board with all the legal moves available, for the player, based on the current state of the board
 * @memberof Othello
 * @function
 * @param {number} player Player, either 1 (Black) or 2 (White)
 * @param {number[][]} legal_moves_board The current legal moves board
 * @returns {(true | false)} True if any element in the legal moves board is equal to the player
 */
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

/**
 *Function which returns the score for a player
 * @memberof Othello
 * @function
 * @param {number} no_legal_move_counter Player, either 1 (Black) or 2 (White)
 * @param {number[][]} board The current state of the game board
 * @returns {number} 1 if the current player is 2; 2 if the current player is 1
 */
Othello.other_player = function(player){
    if (player === 1){
        return 2;
    } else if (player === 2) {
        return 1;
    };
};

/**
 *Function which returns the other player
 * @memberof Othello
 * @function
 * @param {number} player Player, either 1 (Black) or 2 (White)
 * @returns {number} The number of elements, which are equal to player, in the current board
 */
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

/**
 *Checks game over conditions
 * @memberof Othello
 * @function
 * @param {number} no_legal_move_counter Counter which hold how many consecutive plays there have been with no legal moves
 * @param {number[][]} board The current state of the board
 * @returns {(true|false)} Returns true if the sum of the scores is 64, there have been two consecutive plays with no legal moves or either player has no tokens on the board
 */
Othello.game_over = function(no_legal_move_counter, board){
    if ((Othello.score(1, board) + Othello.score(2, board) === 64) || (no_legal_move_counter === 2) || (Othello.score(1, board) === 0) || (Othello.score(2, board) === 0)){
        return true;
    } else {
        return false;
    };
};

/**
 *Determines and returns the winner
 * @memberof Othello
 * @function
 * @param {number[][]} board The current state of the board
 * @returns {text} Returns 'Black' if black's score is higher than white, returns 'Tie' if the two scores are equal, else returns 'White'
 */
Othello.winner = function(board){
    if (Othello.score(1, board) > Othello.score(2, board)){
        return "Black";
    } else if (Othello.score(1, board) === Othello.score(2, board)){
        return "Tie"
    } else {
        return "White"
    }
};

/**
 *Returns the index for a random legal move. Used in the 1 player game mode
 * @memberof Othello
 * @function
 * @param {number} player The player whose turn is being played
 * @param {number[][]} legal_moves_board An array representing all the possible legal moves based on the current state of the game board
 * @returns {number[]} Returns a random index from the 2D list random_legal_moves
 */
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