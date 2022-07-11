import Othello from "../common/Othello.js";
import R from "../common/ramda.js";

const throw_if_invalid = function () {
};


const other_columns_dont_differ = function (column, initial_board, final_board) {
    // Then
    const filtered_initial_columns = initial_board.filter(
        (ignore, col_index) => col_index !== column
    );
    const filtered_final_columns = final_board.filter(
        (ignore, col_index) => col_index !== column
    );
    filtered_final_columns.forEach(function (final_column, col_index) {
        const initial_column = filtered_initial_columns[col_index];
        if (!R.equals(initial_column, final_column)) {
            throw new Error(
                "Columns that were not plied into are not equal\n" +
                `player: ${player}, column: ${column}` +
                "initial: \n" + Connect4.to_string(initial_board) +
                "\n\nfinal: \n" + Connect4.to_string(final_board)
            );
        }
    });
};

describe("Making a ply", function () {

    it(`Given a non-ended board;
When a ply is made by a player in a column;
Then the resultant board is valid;
Only that column differs from the original;
The colulmn's last non-empty slot is the player's token;
The original tokens are in the same order in the final state;
`, function () {
        const initial_boards = [
            {
                "board": Connect4.empty_board(),
                "column": 3
            },
            {
                "board": [
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [1, 2, 0, 0, 0, 0],
                    [1, 2, 0, 0, 0, 0],
                    [1, 2, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ],
                "column": 4
            }
        ];

        initial_boards.forEach(function (initial_board_state) {
            const initial_board = initial_board_state.board;
            const column = initial_board_state.column;
            const player = Connect4.player_to_ply(initial_board);

            // When
            const final_board = Connect4.ply(player, column, initial_board);

            //Then
            throw_if_invalid(final_board);
            other_columns_dont_differ(column, initial_board, final_board);
        });
    });

});
