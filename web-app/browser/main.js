/*jslint es6 */
/*jslint browser:true */
/*global window */

import Othello from "../common/Othello.js";

const params = new URLSearchParams(window.location.search);
const players = params.get('p');
const assisted = params.get('a');
const grid_columns = 8;
const grid_rows = 8;
let player = 1;

let board = Othello.empty_board(grid_columns, grid_rows);
board = Othello.setup_board(board);

let legal_moves_board = Othello.empty_board(grid_columns, grid_rows);
legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board);

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const white_details = document.getElementById("white_details");
const black_details = document.getElementById("black_details");
const black_details_black_turn = document.getElementById("black_details_black_turn");
const white_details_white_turn = document.getElementById("white_details_white_turn");

black_details.style.display = "none";
white_details_white_turn.style.display = "none";
black_details_black_turn.textContent = `Black: ${Othello.score(1, board)}`;
white_details.textContent = `White: ${Othello.score(2, board)}`;

let no_legal_move_counter = 0;

const black_turn_details_display = function () {
    "use strict";
    black_details_black_turn.style.display = "none";
    black_details.style.display = "none";
    white_details.style.display = "none";
    white_details_white_turn.style.display = "none";
    black_details_black_turn.textContent = ``;
    black_details.textContent = ``;
    white_details_white_turn.textContent = ``;
    white_details.textContent = ``;
    black_details_black_turn.textContent = `Black: ${Othello.score(1, board)}`;
    white_details.textContent = `White: ${Othello.score(2, board)}`;
    black_details_black_turn.style.display = "block";
    white_details.style.display = "block";
};

const white_turn_details_display = function () {
    "use strict";
    black_details_black_turn.style.display = "none";
    black_details.style.display = "none";
    white_details.style.display = "none";
    white_details_white_turn.style.display = "none";
    black_details_black_turn.textContent = ``;
    black_details.textContent = ``;
    white_details_white_turn.textContent = ``;
    white_details.textContent = ``;
    black_details.textContent = `Black: ${Othello.score(1, board)}`;
    white_details_white_turn.textContent = `White: ${Othello.score(2, board)}`;
    black_details.style.display = "block";
    white_details_white_turn.style.display = "block";
};


const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const update_grid = function () {
    "use strict";
    cells.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            const token = board[column_index][row_index];
            cell.classList.remove("empty");
            cell.classList.remove("token_1");
            cell.classList.remove("token_2");
            cell.classList.remove("token_3");
            cell.classList.remove("token_3_black");
            cell.classList.remove("empty_black");
            cell.classList.remove("token_3_white");
            cell.classList.remove("empty_white");
            if (player === 1) {
                if (token === 0) {
                    cell.classList.add("empty_black");
                }
                if (token === 1) {
                    cell.classList.add("token_1");
                }
                if (token === 2) {
                    cell.classList.add("token_2");
                }
            } else {
                if (token === 0) {
                    cell.classList.add("empty_white");
                }
                if (token === 1) {
                    cell.classList.add("token_1");
                }
                if (token === 2) {
                    cell.classList.add("token_2");
                }
            }
        });
    });

    legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board);

    cells.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            const token = legal_moves_board[column_index][row_index];
            if (player === 1) {
                if (token === player) {
                    if (assisted === '1') {
                        cell.classList.add("token_3_black");
                    } else {
                        cell.classList.add("token_3");
                    }
                }
            } else {
                if (token === player) {
                    if (assisted === '1') {
                        cell.classList.add("token_3_white");
                    } else {
                        cell.classList.add("token_3");
                    }
                }
            }
        });
    });

    white_turn_details_display();
    black_turn_details_display();

    if (Othello.game_over(no_legal_move_counter, board) === true) {
        if (Othello.winner(board) !== "Tie") {
            window.alert(`Game Over! ${Othello.winner(board)} wins!`);
        } else {
            window.alert(`Game Over! It's a tie!`);
        }
    }
};


const cells = range(grid_rows).map(function (row_index) {
    "use strict";
    const row = document.createElement("div");
    row.className = "row";
    const rows = range(grid_columns).map(function (column_index) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = function () {
            legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board);
            if (Othello.game_over(no_legal_move_counter, board) === false) {
                if (Othello.legal_moves_available(player, legal_moves_board)) {
                    if (legal_moves_board[column_index][row_index] === player) {
                        board = Othello.place_token(player, column_index, row_index, board);
                        setTimeout(flip_tokens(player, column_index, row_index, board), 100);
                        player = Othello.other_player(player);
                        update_grid();
                        if (player === 1) {
                            black_turn_details_display();
                        } else {
                            white_turn_details_display();
                        }
                        if (players === '1' && player === 2) {
                            setTimeout(autoplace(), 100);
                        }
                        no_legal_move_counter = 0;
                    } else {
                        if (Othello.is_cell_empty(column_index, 7 - row_index, board) === false) {
                            window.alert(`Play Again || Only place in an empty cell`);
                        } else {
                            window.alert(`Play Again || Not a legal move`);
                        }
                    }
                } else {
                    window.alert(`Switching player... No legal move available for player ${player}`);
                    player = Othello.other_player(player);
                    no_legal_move_counter = no_legal_move_counter + 1;
                    if (player === 1) {
                        black_turn_details_display();
                        update_grid();
                    } else {
                        white_turn_details_display();
                        update_grid();
                        if (players === '1' && player === 2) {
                            setTimeout(autoplace(), 100);
                        }
                    }
                }
            } else {
                if (Othello.game_over(no_legal_move_counter, board) === true) {
                    if (Othello.winner(board) !== "Tie") {
                        window.alert(`Game Over! ${Othello.winner(board)} wins!`);
                    } else {
                        window.alert(`Game over || It's a tie!`);
                    }
                }
            }
        };
        row.append(cell);
        return cell;
    });
    grid.append(row);
    return rows;
});

update_grid();

const autoplace = function () {
    "use strict";
    if (players === '1' && player === 2 && (Othello.game_over(no_legal_move_counter, board) === false)) {
        legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board);
        if (Othello.game_over(no_legal_move_counter, board) === false) {
            if (Othello.legal_moves_available(player, legal_moves_board)) {
                let col_num = Othello.random_legal_move(player, legal_moves_board);
                let row_num = col_num[1];
                col_num = col_num[0];
                if (legal_moves_board[col_num][row_num] === player) {
                    board = Othello.place_token(player, col_num, row_num, board);
                    setTimeout(flip_tokens(player, col_num, row_num, board), 100);
                    player = Othello.other_player(player);
                    no_legal_move_counter = 0;
                    update_grid();
                    if (player === 1) {
                        black_turn_details_display();
                    } else {
                        white_turn_details_display();
                    }
                } else {
                    if (Othello.is_cell_empty(col_num, 7 - row_num, board) === false) {
                        window.alert(`Play again || Only place in an empty cell`);
                    } else {
                        window.alert(`Play again || Not a legal move`);
                    }
                }
            } else {
                window.alert(`Switching Player ... No legal move available for player ${player}`);
                player = Othello.other_player(player);
                no_legal_move_counter = no_legal_move_counter + 1;
                if (player === 1) {
                    black_turn_details_display();
                } else {
                    white_turn_details_display();
                }
            }
        } else {
            if (Othello.game_over(no_legal_move_counter, board) === true) {
                if (Othello.winner(board) !== "Tie") {
                    window.alert(`Game Over! {Othello.winner(board)} wins!`);
                } else {
                    window.alert(`Game over! It's a tie!`);
                }
            }
        }
        update_grid();
    }
};

function flip_line(player, delta_column, delta_row, column_index, row_index, temp_board) {
    "use strict";
    if ((row_index + delta_row < 0) || (row_index + delta_row > 7)) {
        return false;
    }
    if ((column_index + delta_column < 0) || (column_index + delta_column > 7)) {
        return false;
    }
    if (temp_board[column_index + delta_column][row_index] === 0) {
        return false;
    }
    if (temp_board[column_index + delta_column][row_index + delta_row] === player) {
        return true;
    } else {
        if (flip_line(player, delta_column, delta_row, column_index + delta_column, row_index + delta_row, temp_board)) {
            board = Othello.place_token(player, column_index + delta_column, row_index + delta_row, board);
            return true;
        } else {
            return false;
        }
    }
}


function flip_line2(player, delta_column, delta_row, column_index, row_index, temp_board) {
    "use strict";
    if ((row_index + delta_row < 0) || (row_index + delta_row > 7)) {
        return false;
    }
    if ((column_index + delta_column < 0) || (column_index + delta_column > 7)) {
        return false;
    }
    if (temp_board[column_index + delta_column][row_index + delta_row] === 0) {
        return false;
    }
    if (temp_board[column_index + delta_column][row_index + delta_row] === player) {
        return true;
    } else {
        if (flip_line2(player, delta_column, delta_row, column_index + delta_column, row_index + delta_row, temp_board)) {
            board = Othello.place_token(player, column_index + delta_column, row_index + delta_row, board);
            return true;
        } else {
            return false;
        }
    }
}


function flip_tokens(player, column_index, row_index, board) {
    "use strict";
    flip_line(player, 0, 1, column_index, row_index, board);
    flip_line(player, 0, -1, column_index, row_index, board);
    flip_line(player, 1, 0, column_index, row_index, board);
    flip_line(player, -1, 0, column_index, row_index, board);
    flip_line2(player, 1, 1, column_index, row_index, board);
    flip_line2(player, -1, -1, column_index, row_index, board);
    flip_line2(player, 1, -1, column_index, row_index, board);
    flip_line2(player, -1, 1, column_index, row_index, board);
}
