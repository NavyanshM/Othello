/**
 * @namespace Othello
 * @description Othello.js defines the gameplay, rules and conditions for the game Othello. This game module can be implemented with a HTML and CSS web-app interface. 
 * @author Navyansh Malhotra
 * @version v1.0
 */

import R from "../common/ramda.js";

const Othello = Object.create(null);
const width = 8;
const height = 8;

Othello.token_strings = Object.freeze({
    "default": ["0", "1", "2"],
    "disks": ["", "⚫", "⚪"]
});

Othello.empty_board = function (width, height) {
    return R.repeat(R.repeat(0, height), width);
};


//https://www.youtube.com/watch?v=XseyfdrHmoY&list=PLA7VQFdAJ2vfytZFoskFIBYLlNuCUGi0N&index=7&ab_channel=Mr.Soderquist
//https://www.youtube.com/watch?v=_7Jz4MbAjCE&ab_channel=djp3


Othello.setup_board = function(board){
    board = Othello.place_token(1, 3, 4, board);
    board = Othello.place_token(1, 4, 3, board);
    board = Othello.place_token(2, 3, 3, board);
    board = Othello.place_token(2, 4, 4, board);
/*     board = Othello.place_token(2, 4, 5, board);
    board = Othello.place_token(2, 4, 6, board);
    board = Othello.place_token(1, 2, 3, board);
    board = Othello.place_token(1, 2, 2, board); 
    board = Othello.place_token(2, 3, 6, board);   */
    return board;
};

//if (board[3][4] === 1){
//board = Othello.place_token(2, 0, 0, board);
//};

/* Othello.player_to_ply = function (board) {
    const flattened_board = R.flatten(board);
    return (
        R.count(
            R.equals(1),
            flattened_board
        ) === R.count(
            R.equals(2),
            flattened_board
        )
            ? 2
            : 1
    );
}; */

Othello.place_token = function (player, column_index, row_index, board) {
    return R.update(
        column_index,
        R.update(7 - row_index, player, board[column_index]),
        board
    );
};


Othello.is_ended= function(board) {
    return false;
};

Othello.size = function (board) {
    return [board.length, board[0].length];
};

Othello.is_cell_empty = function (column_index, row_index, board) {
    if (board[column_index][width - 1 - row_index] === 0) {
        return true;
    }
    else{
        return false;
    };
};


/* Othello.is_valid_move = function (player, column_index, row_index, board) {
    if ((Othello.north(player, column_index, row_index, board) || Othello.south(player, column_index, row_index, board)) && (Othello.is_cell_empty(column_index, row_index, board))) {
        return true; 
    } else { 
        return false; 
    };
};
 */
//checks only one on top
/* Othello.north = function (player, column_index, row_index, board) { 
    if ((height - row_index < height) && (board[column_index][height - row_index ] === Othello.other_player(player))){
        return true;
    };
}; 
 */

/* Othello.north = function (player, column_index, row_index, board) { 
    //slice array when checking from the ladt emptyu to the placed postion 
    
    if ((height - row_index < height) && (Othello.column_as_array(board, column_index).includes(player, height - row_index + 1)) && (board[column_index][height - row_index ] === Othello.other_player(player))){
        return true;
    } else {
        return false;
    }; 
};  */

/* Othello.south = function (player, column_index, row_index, board) { 
/*     if (height - row_index > 1){
        return true; 
    } */
    
    //if ((height - row_index > 1) && (board[column_index][height - row_index + 1] === Othello.other_player(player))){
/*     if ((height - row_index > 1) && (board[column_index][row_index - 1] === player)){
        return true;
    } else {
        return false; 
    };  */
    //return false; 
//}; 

/* Othello.east = function (player, column_index, row_index, board) { 
    return false;
};  */

/* Othello.west = function (player, column_index, row_index, board) { 
    return false;
}; 
 */
//remove Othello. from local functions not called by main 


Othello.check_line = function (player, delta_column, delta_row, column_index, row_index, board){
    if (board[column_index][row_index] === player){
        return true; 
    }; 


    if (board[column_index][row_index] === 0){
        return false; 
    }; 

    
    if ((row_index + delta_row < 0) || (row_index + delta_row > height - 1)){
        return false; 
    };

    if ((column_index + delta_column < 0) || (column_index + delta_column > width - 1)){
        return false; 
    };

    return (Othello.check_line(player, delta_column, delta_row, column_index + delta_column, row_index + delta_row, board));  
    //return false;
};

Othello.adjacent_support = function(player, delta_column, delta_row, column_index, row_index, board){
    //make let const? 
    let other_player = Othello.other_player(player);

    if ((row_index + delta_row < 0) || (row_index + delta_row > height - 1)){
        return false; 
    };

    if ((column_index + delta_column < 0) || (column_index + delta_column > width - 1)){
        return false; 
    };

    if (board[column_index+delta_column][row_index+delta_row] !== other_player){
        return false; 
    };

    if ((row_index + delta_row + delta_row < 0) || (row_index + delta_row + delta_row > height - 1)){
        return false; 
    };

    if ((column_index + delta_column + delta_column < 0) || (column_index + delta_column + delta_column > width - 1)){
        return false; 
    };

    return Othello.check_line(player, delta_column, delta_row, column_index + delta_column + delta_column, row_index + delta_row + delta_row, board);  
    //return true; 
}; 

Othello.find_valid_moves = function(player, legal_moves_board, board){
    for (let row = 0; row < height; row++){
        for (let column = 0; column < width; column++){
            if (Othello.is_cell_empty(column, row, board)){
                //legal_moves_board = Othello.place_token(player, column, row, legal_moves_board);
                let north = Othello.adjacent_support(player, 0, -1, column, row, board);
                let south = Othello.adjacent_support(player, 0, 1, column, row, board);
                let east = Othello.adjacent_support(player, 1, 0, column, row, board);
                let west = Othello.adjacent_support(player, -1, 0, column, row, board);
                let north_west = Othello.adjacent_support(player, -1, -1, column, row, board);
                let north_east = Othello.adjacent_support(player, 1, -1, column, row, board);
                let south_west = Othello.adjacent_support(player, -1, -1, column, row, board);
                let south_east = Othello.adjacent_support(player, 1, 1, column, row, board);  

               if (north || south || east || west || north_east || north_west || south_east || south_west){
                    legal_moves_board = Othello.place_token(player, column, row, legal_moves_board);
                };  

                /*if (north){
                    legal_moves_board = Othello.place_token(player, column, row, legal_moves_board);
                };*/

                //legal_moves_board[column_index][row_index] = 1; 
            };
        };
    };   

 /*   for (let column = 0; column < 8; column++){
        for (let row = 0; row < 8; row++){
            if (Othello.is_cell_empty(column, row, board)){
                //north = Othello.adjacent_support(player, 0, -1, column, row, board);
                if (true){
                    legal_moves_board = Othello.place_token(player, column, 7 - row, legal_moves_board); 
                }
            }
        }
    } */

    //legal_moves_board = Othello.place_token(1, 0, 0, legal_moves_board); 
    //legal_moves_board = Othello.place_token(1, 0, 0, legal_moves_board);   
    return legal_moves_board;
};

/* 
Othello.find_valid_moves = function(player, legal_moves_board, board){
    const column = 0; 
    const row = 0; 
    
    const north = true;
    const south = true;
    const east = true;
    const west = true;
    const north_west = true;
    const north_east = true;
    const south_west = true;
    const south_east = true;
    if (north || south || east || west || north_east || north_west || south_east || south_west){
        legal_moves_board = Othello.place_token(player, column, row, legal_moves_board);
    };
                //legal_moves_board[column_index][row_index] = 1; 

    return legal_moves_board;
};  */


Othello.column_as_array = function (board, column_index) {
    const column = board[column_index];
    /* for (let i = 0; i < height; i++) {
        column.push(board[column_index][i]);
    }; */
    //column = R.reverse(column); 
    return column;
};

Othello.row_as_array = function (board, row_index) {
    const row = R.transpose(board)[row_index];
    /* for (let i = 0; i < height; i++) {
        column.push(board[column_index][i]);
    }; */
    //column = R.reverse(column); 
    return row;
};

Othello.other_player = function(player){
    if (player === 1){
        return 2;
    } else if (player === 2) {
        return 1;
    };
};

export default Object.freeze(Othello);