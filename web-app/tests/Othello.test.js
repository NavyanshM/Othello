/**
* @namespace Othello.test
* @description Othello.test is a set of tests using the moch framework, to test various states, conditions and functions of the Othello gameboard and API
* @author Navyansh Malhotra
* @version v1.0
*/

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
* @memberof Othello.test
* @function
* @param {Board} board The board to test
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

describe("Setup placement", function () {
    it("Setup board as per game rules", function () {
        let board = Othello.empty_board(8, 8);
        board = Othello.setup_board(board);
        if (
            (board[4][3] !== 1) && (board[4][3] !== 1) && (board[3][3] !== 2) && (board[4][4] !== 2)
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
    })

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
    })
});