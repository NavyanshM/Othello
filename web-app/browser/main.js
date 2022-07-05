import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";

import Othello from "../common/Othello.js";

const grid_columns = 8;
const grid_rows = 8;
let player = 2; 

let board = Othello.empty_board(grid_columns, grid_rows);
board = Othello.setup_board(board);

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const footer = document.getElementById("footer");

//board[x] is column x
//footer.textContent = `${Othello.row_as_array(board, 2)} | ${board[4]}`;

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function (row_index) {
    const row = document.createElement("div");
    row.className = "row"; 

    const rows = range(grid_columns).map(function (column_index) {
        const cell = document.createElement("div");
        cell.className = "cell";

        cell.onclick = function () {
            //player = Othello.other_player;
            //cell.textContent = `(${row_index}, ${column_index})`;
            //const legal_move = Othello.free_columns(
                //board
            //).includes(column_index);
            if (Othello.is_valid_move(player, column_index, row_index, board)) {
                //footer.textContent = `${board[column_index][grid_rows - 1 - row_index]}`
                board = Othello.place_token(player, column_index, row_index, board);
                //footer.textContent = `${}`;
                //Connect4.is_cell_empty(column_index, row_index, board); 
                update_grid();
                //footer.textContent = `MOVE MADE | PLAYER ${player} TO PLAY!`; 
                //console.log(column_index);
                //const text = board[column_index][grid_rows - 1 - row_index];
                //const text = Othello.column_as_array(board, column_index); 
                //const text = "test" 
                //let text = column_index;
                //footer.textContent = `${text}`;
            } else { 
                //footer.textContent = `${text}`;
                if (Othello.is_cell_empty(column_index, row_index, board) === false){
                    //footer.textContent = `ONLY PLACE IN AN EMPTY CELL`;  
                } else {
                    //footer.textContent = `NOT A VALID MOVE`; 
                };
            };
            //footer.textContent = `${R.transpose(board)}`; 
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
    player = Othello.other_player(player);
    //footer.textContent = `Player ${Othello.other_player(player)} to play!`;
};

update_grid();
