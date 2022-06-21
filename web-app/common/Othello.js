/**
 * Othello.js defines the gameplay and rules for reversing othello.
 * @namespace Othello
 * @author Navyansh Malhotra
 * @version v1.0
 */

/**
 * @memberof Stats4
 * @typedef {Object} Statistics
 * @property {number} elo The Elo score of the player.
 * {@link https://en.wikipedia.org/wiki/Elo_rating_system}
 * @property {number} player_1_wins How many times the player
 * has won when playing first.
 * @property {number} player_1_losses How many times the player
 *     has lost when playing first.
 * @property {number} player_1_draws How many times the player has
 *     tied when playing first.
 * @property {number} player_2_wins How many times the player has
 *     won when playing second.
 * @property {number} player_2_losses How many times the player has
 *     lost when playing second.
 * @property {number} player_2_draws How many times the player has
 *     tied when playing second.
 * @property {number} current_streak The number of games the player has won
 *     since last losing (or ever if the player has never lost).
 * @property {number} longest_streak The most consecutive games won.
 */

import R from "../common/ramda.js";

const othello = Object.create(null);

Connect4.token_strings = Object.freeze({
    "default": ["0", "1", "2"],
    "disks": ["","⚪","⚫"] 
});

Othello.empty_board = function (width = 8, height = 8) {
    return R.repeat(R.repeat(0, height), width);
};

Othello.place_token = function(player, column_index, row_index, board){
    return  R.update(
        column_index,
        R.update(row_index, player, board[column_index]),
        board
    );
}

Othello.setup_board = function(board){
    board = Connect4.place_token(1, 3, 4, board);
    board = Connect4.place_token(1, 4, 3, board);
    board = Connect4.place_token(2, 3, 3, board);
    board = Connect4.place_token(2, 4, 4, board);
    return board; 
}; 


export default Object.freeze(Connect4);