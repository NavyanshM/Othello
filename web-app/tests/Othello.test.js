/**
* @namespace Othello.test
* @description Othello.test is a set of tests using the moch framework, to test various states, conditions and functions of the Othello gameboard and API
* @author Navyansh Malhotra
* @version v1.0
*/

import e from "express";
import { F, or } from "rambda";
import Othello from "../common/Othello.js";
import R from "../common/ramda.js";

const DISPLAY_MODE = "to_string";

const display_functions = {
    "json": JSON.stringify,
    "to_string": Othello.to_string_with_tokens(Othello.token_strings.disks)
};

const display_board = function (board) {
    "use strict";
    try {
        return "\n" + display_functions[DISPLAY_MODE](board);
    } catch (ignore) {
        return "\n" + JSON.stringify(board);
    }
};

/**
* Returns if the board is in a valid state
* A board is valid if all the following are true:
* - the board is a 2d array
* - there are 64 elemnts in the board
* - there are 8 columns and 8 rows
* - all elements' values are either a 0, 1 or 2
* - *this test has been adapted from Freddie Page's example code*
* @memberof Othello.test
* @function
* @param {board} board The board to test
* @throws if the board fails any of the above conditions
*/
const throw_if_invalid = function (board) {
    "use strict";
    if (!Array.isArray(board) || !Array.isArray(board[0])) {
        throw new Error(
            "The board is not a 2D array: " + display_board(board)
        );
    }
    const height = board[0].length;
    if (height !== 8){
        throw new Error(
            "The height of the board is not 8: " + display_board(board)
        );
    }
    const rectangular = R.all(
        (column) => column.length === height,
        board
    );
    const num_elements = height * R.transpose(board)[0].length;
    if (num_elements !== 64){
        throw new Error(
            "There are not 64 elements in the board : " + display_board(board)

        );
    }
    if (!rectangular) {
        throw new Error(
            "The board is not rectangular: " + display_board(board)
        );
    }

    const valid_tokens = [0, 1, 2];
    const contains_valid_tokens = R.pipe(
        R.flatten,
        R.all((slot) => valid_tokens.includes(slot))
    )(board);
    if (!contains_valid_tokens) {
        throw new Error(
            "The board contains invalid tokens: " + display_board(board)
        );
    }
};

describe("Empty Board", function () {
    it("An empty board is a valid board", function () {
        const empty_board = Othello.empty_board(8,8);
        throw_if_invalid(empty_board);
    });

    it("An empty board has all free elements", function () {
        const empty_board = Othello.empty_board(8,8);
        const all_free_slots = R.pipe(
            R.flatten,
            R.all(R.equals(0))
        )(empty_board);
        if (!all_free_slots) {
            throw new Error(
                "The empty board has filled slots: " +
                display_board(empty_board)
            );
        }
    });

    it("An empty board has no winning player", function () {
        const empty_board = Othello.empty_board(8,8);
        if (
            Othello.winner(empty_board) !== 'Tie'
        ) {
            throw new Error(
                "The empty board has a winning player: " +
                display_board(empty_board)
            );
        }
    });
});

/**
* Returns if the board after setup follows the game rules and is as expected
* The board is valid if all the following are true:
* - element column: 4 row: 3 is 1
* - element column: 4 row: 4 is 1
* - element column: 3 row: 3 is 2
* - element column: 4 row: 4 is 2
* - there are are only 2 white tokens on the board
* - there are only 2 black tockens on the board
* - there are only 4 tockens in total on the board
* @memberof Othello.test
* @function
* @throws if the board fails any of the above conditions
*/
describe("Setup placement", function () {
    it("Setup board as per game rules", function () {
        let board = Othello.empty_board(8, 8);
        board = Othello.setup_board(board);
        if (
            (board[4][3] !== 1) && (board[3][4] !== 1) && (board[3][3] !== 2) && (board[4][4] !== 2)
        ) {
            throw new Error(
                "The setup placement of the board is wrong" +
                display_board(board)
            );
        }
        if (
            Othello.score(1, board) !== 2
        ) {
            throw new Error(
                "The board does not have 2 black tockens" +
                display_board(board) +
                " it has " +
                Othello.score(1, board)
            );
        }
        if (
            Othello.score(2, board) !== 2
        ) {
            throw new Error(
                "The board does not have 2 white tockens" +
                display_board(board) +
                " it has " +
                Othello.score(2, board)
            );
        }
        if (
            Othello.score(2, board) + Othello.score(2, board) !== 4
        ) {
            throw new Error(
                "The board does not have 4 tokens in total" +
                display_board(board) +
                " it has " +
                Othello.score(2, board) + Othello.score(2, board) 
            );
        }
    });
});


/**
* Checks there are only 2 players who can place tokens: Black (1) and White (2)
* @memberof Othello.test
* @function
* @throws if there are more than 2 players who can make a ply
*/
describe("Switching player", function () {
    it("White's other player is black", function () {
        const player = 1;
        if (
            Othello.other_player(player) !== 2
        ) {
            throw new Error(
                "The other player is not white(2), it is " +
                Othello.other_player(player) 
            );
        }
    });

    it("Blacks's other player is white", function () {
        const player = 2;
        if (
            Othello.other_player(player) !== 1
        ) {
            throw new Error(
                "The other player is not black(1), it is " +
                Othello.other_player(player)
            );
        }
    });
});

/**
* Returns if the game has ended
* The game has ended if any of the following are true:
* - White's score + Black's score is 64
* - 2 consecitive ply turns with no legal moves avaialable
* - either player have 0 tokens on the board
* @memberof Othello.test
* @function
* @throws if the game_over functions fails any of the above conditions
*/
describe("Game ended", function () {
    "use strict";
    let no_legal_move_counter = 0;
    let board = Othello.empty_board(8,8);
    for (let i = 0; i < 5; i++){
        for (let j = 0; j < 8; j++){
            board = Othello.place_token(1, i , j, board)
        }
    }
    for (let i = 5; i < 8; i++){
        for (let j = 0; j < 8; j++){
            board = Othello.place_token(2, i , j, board)
        }
    }
    it("Total score is 64", function () {
        if (
            (Othello.score(1, board) + Othello.score(2, board) !== 64) && (Othello.game_over(no_legal_move_counter, board))
        ) {
            throw new Error(
                "Game is over when not all the cells are full " +
                board +
                "Black token count: " +
                Othello.score(1, board) +
                "White token count: " +
                Othello.score(2, board)
            );
        }
    })

    it("2 consecitive ply turns with no legal moves available", function () {
        board = Othello.empty_board(8,8);
        for (let i = 0; i < 5; i++){
            for (let j = 0; j < 8; j++){
                board = Othello.place_token(1, i , j, board)
            }
        }
        for (let i = 5; i < 8; i++){
            for (let j = 0; j < 7; j++){
                board = Othello.place_token(2, i , j, board)
            }
        }
        no_legal_move_counter = 2;
        if (
            (no_legal_move_counter === 2) && (Othello.game_over(no_legal_move_counter, board) === false)
        ) {
            throw new Error(
                "2 consecitive ply turns with no legal moves available but game is not over " +
                board
            );
        }
    })

  it("Black has no tokens on the board", function () {
        no_legal_move_counter = 0;
        board = Othello.empty_board(8,8);
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 7; j++){
                board = Othello.place_token(2, i , j, board)
            }
        }
        if (
            (Othello.score(1, board) === 0) && (Othello.game_over(no_legal_move_counter, board) === false)
        ) {
            throw new Error(
                "there are no blacks tokens on the board but the game is not over " +
                board
            );
        }
    })

    it("White has no tokens on the board", function () {
        no_legal_move_counter = 0;
        board = Othello.empty_board(8,8);
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 7; j++){
                board = Othello.place_token(1, i , j, board)
            }
        }
        if (
            (Othello.score(2, board) === 2) && (Othello.game_over(no_legal_move_counter, board) === false)
        ) {
            throw new Error(
                "there are no white tokens on the board but the game is not over " +
                board
            );
        }
    })

    it("Conditions satisfid but the game is not over", function () {
        no_legal_move_counter = 2;
        board = Othello.empty_board(8,8);
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 7; j++){
                board = Othello.place_token(1, i , j, board)
            }
        }
        if (
            Othello.game_over(no_legal_move_counter, board) === false
        ) {
            throw new Error(
                "no legal move counter is 2 and the oard only has black tokens but the game is not over " +
                board
            );
        }
    })
});

/**
* Tests the place token function
* Valid only if all the conditions are satisfied
* - All elements of the board are the same except one, as long as the placed token is placed in a slot that was either the other player or empty
* - Non-zero elements decreases by one as long as the token was placed in an empty element
* @memberof Othello.test
* @function
* @throws if the game_over functions fails any of the above conditions
*/
describe("Place token", function () {
    "use strict";
    let board = Othello.empty_board(8,8);
    let orig_board = board;
    let difference_counter = 0;
    it("Black token replaces a white token slot and only that solt has changed", function () {
        board = Othello.setup_board(board);
        orig_board = board;
        board = Othello.place_token(1,3,3,board);
        difference_counter = 0;
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (board[i][j] !== orig_board[i][j]){
                    difference_counter = difference_counter + 1;
                }
            }
        }
        if (
            difference_counter !== 1
        ) {
            throw new Error(
                "token difference is not 1, it is" +
                difference_counter +
                board +
                " " +
                orig_board
            );
        }
    })
    it("Token placed in empty slot and only that solt has changed", function () {
        board = Othello.setup_board(board);
        orig_board = board;
        board = Othello.place_token(1,7,7,board);
        difference_counter = 0;
        let empty_counter_board = 0;
        let empty_counter_orig_board = 0;
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (board[i][j] !== orig_board[i][j]){
                    difference_counter = difference_counter + 1;
                }
                if (board[i][j] === 0){
                    empty_counter_board = empty_counter_board + 1;
                }
                if (orig_board[i][j] === 0){
                    empty_counter_orig_board = empty_counter_orig_board + 1;
                }
            }
        }
        if (
            (difference_counter !== 1) || (empty_counter_board + 1 !== empty_counter_orig_board)
        ) {
            throw new Error(
                "token difference is not 1, it is" +
                difference_counter +
                board +
                " " +
                orig_board
            );
        }
    })
});

/**
* Checks who the game winner is, if any player, assuming a stale-mate position has been reached
* The game ended conditions have been tested before hence don't need to be re-tested
* @memberof Othello.test
* @function
* @throws if the winner functions fails any of the conditions
*/
describe("Winner", function () {
    "use strict";
    let board = Othello.empty_board(8,8);
    it("Tie", function () {
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 8; j++){
                board = Othello.place_token(1, i , j, board)
            }
        }
        for (let i = 4; i < 8; i++){
            for (let j = 0; j < 8; j++){
                board = Othello.place_token(2, i , j, board)
            }
        }
        if (
            Othello.winner(board) !== "Tie"
        ) {
            throw new Error(
                "Scores are equal but the game is not a tie " +
                board + 
                " Othello.winner(): " +
                Othello.winner(board)
            )
        }
    })
});