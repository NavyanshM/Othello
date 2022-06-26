import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";

import Othello from "../common/Othello.js";

const grid_columns = 8;
const grid_rows = 8;

let board = Othello.empty_board(grid_columns, grid_rows);
board = Othello.setup_board(board); 

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const footer = document.getElementById("footer");

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function (row_index) {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function (column_index) {
        const cell = document.createElement("div");
        cell.className = "cell";
        
        cell.onclick = function () {
            //cell.textContent = `(${row_index}, ${column_index})`;
            //const legal_move = Othello.free_columns(
                //board
            //).includes(column_index);
            if (Othello.is_cell_empty(column_index, row_index, board)) {
                //footer.textContent = `${board[column_index][grid_rows - 1 - row_index]}`
                const player = Othello.player_to_ply(board);
                board = Othello.ply(player, column_index, row_index, board);
                //footer.textContent = `${}`;
                //Connect4.is_cell_empty(column_index, row_index, board); 
                update_grid();
                //const text = board[column_index][grid_rows - 1 - row_index];
                //footer.textContent = `${text}`;
            }
        };

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const update_grid = function () {
    cells.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            const token = board[column_index][grid_rows - 1 - row_index];
            cell.classList.remove("empty");
            cell.classList.remove("token_1");
            cell.classList.remove("token_2");
            if (token === 0) {
                cell.classList.add("empty");
            }
            if (token === 1) {
                cell.classList.add("token_1");
            }
            if (token === 2) {
                cell.classList.add("token_2");
            }
        });
    });
    const player = Othello.player_to_ply(board);
    //footer.textContent = `Player ${player} to play!`;
};

update_grid();
