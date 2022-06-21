import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";

import Connect4 from "../common/Connect4.js";

const grid_columns = 8;
const grid_rows = 8;

let board = Connect4.empty_board();
board = Connect4.setup_board(board); 
//board = Connect4.setup_board_topright(board); 

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
            const legal_move = Connect4.free_columns(
                board
            ).includes(column_index);
            if (legal_move) {
                const player = Connect4.player_to_ply(board);
                board = Connect4.ply(player, column_index, row_index, board);
                update_grid();
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
    const player = Connect4.player_to_ply(board);
    footer.textContent = `Player ${player} to play!`;
};

update_grid();
