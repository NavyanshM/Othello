import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";

import Othello from "../common/Othello.js";

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
const footer = document.getElementById("footer");

//board[x] is column x
//footer.textContent = `${Othello.row_as_array(board, 2)} | ${board[4]}`;

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

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

    
    //PUT UNDER ONLY IF VALID MOVE!!!! 
    /* legal_moves_board = Othello.empty_board(8, 8);
    legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board); 
    footer.textContent = `${legal_moves_board} || ${board} || ${player}`; */
    
    //let legal_moves_board = Othello.empty_board(grid_columns, grid_rows);
    //legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board); 
    //footer.textContent = `${legal_moves_board} || ${board} || ${player}`;
    //footer.textContent = `Player ${Othello.other_player(player)} to play!`;
};

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
            //let legal_moves_board = Othello.empty_board(grid_columns, grid_rows);
            legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board); 
            //let legal_moves_board = [1]; 
            //footer.textContent = `${legal_moves_board} || ${board} || ${player}`;
            //footer.textContent = `${board} || ${player}`;
            //if (Othello.is_valid_move(player, column_index, row_index, board)) {
            //REMOVE CHECK EMPTY ELEMENT 
            if ((legal_moves_board[column_index][row_index] === player)) {
                board = Othello.place_token(player, column_index, row_index, board);
                //footer.textContent = `${}`;
                //Connect4.is_cell_empty(column_index, row_index, board); 
                //update_grid();

            
                //legal_moves_board = Othello.find_valid_moves(player, legal_moves_board, board); 
                //footer.textContent = `${legal_moves_board} || ${board} || ${player}`;

                //footer.textContent = `MOVE MADE | PLAYER ${player} TO PLAY!`; 
                //console.log(column_index);
                //const text = board[column_index][grid_rows - 1 - row_index];
                //const text = Othello.column_as_array(board, column_index); 
                //const text = "test" 
                //let text = column_index;
                //footer.textContent = `${text}`;
                //board = Othello.flip_tokens(player, column_index, row_index, board); 
                //update_grid();
                //update_grid(); 
                //
/*                 update_grid(); 
                update_grid();  */
                //footer.textContent = `${column_index} , ${row_index} PLACED || PLAYER ${player}'S MOVE`;  
                //update_grid();
                const col = column_index;
                const row = row_index; 

                board = Othello.flip_line(player, 0, -1,col, row, board)[0]; 
                //update_grid();
                board = Othello.flip_line(player, 0, 1, col, row, board)[0];
                //update_grid();
                board = Othello.flip_line(player, 1, 0, col, row, board)[0];
                //update_grid();
                board = Othello.flip_line(player, -1, 0, col, row, board)[0];
                //update_grid();
                board = Othello.flip_line(player, -1, 1, col, row, board)[0];
                //update_grid();
                board = Othello.flip_line(player, 1, -1, col, row, board)[0];
                //update_grid();
                board = Othello.flip_line(player, -1, -1, col, row, board)[0];
                //update_grid();
                board = Othello.flip_line(player, 1, 1, col, row, board)[0];  

                

                //update_grid();

                update_grid();
                
                player = Othello.other_player(player);

                //let text = Othello.flip_tokens(player, column_index, row_index, board); 
                footer.textContent = `${column_index} , ${row_index} PLACED || PLAYER ${player}'S MOVE || ${board}`;
                //footer.textContent = `${temp_board}`;  
            } else { 
                //footer.textContent = `${text}`;
                if (Othello.is_cell_empty(column_index, row_index, board) === false){
                    footer.textContent = `ONLY PLACE IN AN EMPTY CELL || PLAYER ${player}'S MOVE `;  
                    //footer.textContent = `ONLY PLACE IN AN EMPTY CELL || ${column_index} , ${row_index} is a ${board[column_index][row_index]} `;  
                } else {
                    footer.textContent = `NOT A VALID MOVE || PLAYER ${player}'S MOVE`; 
                    //footer.textContent = `NOT A VALID MOVE || ${column_index} , ${row_index} is a ${board[column_index][row_index]}|| ${board} || ${legal_moves_board}`; 
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


//player = Othello.other_player(player);
update_grid();

//used to be in update grid 
