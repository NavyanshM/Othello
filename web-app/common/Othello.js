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
