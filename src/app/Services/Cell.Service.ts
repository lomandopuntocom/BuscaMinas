import { Cell } from "../Models/Cell";

export class CellService{
    make_board(column:number, row:number, mines_number:number){
        let board:Cell[][] = []
        for(let i = 0; i < row; i++){
            let rows:Cell[] = [];
            for(let j = 0; j < column; j++){
                let element : Cell = {state:'closed', is_mine : false, mines_around : 0};
                rows.push(element)
            }
            board.push(rows);
        }
        this.put_mines(mines_number, board, row, column);
        this.seek_mines_around(board, row, column);

        return board;
    }


    put_mines(mines_number:number, board: Cell[][], row:number, column:number){
        let mines_location = new Set<([Number, Number])>;
        let i:number = 0
        while(i < mines_number){
            let random_location: [number, number] = [Math.floor(Math.random() * (row)), Math.floor(Math.random() * (column))]

            if(!mines_location.has(random_location)){
                if(!board[random_location[0]][random_location[1]].is_mine){
                    mines_location.add(random_location);
                    board[random_location[0]][random_location[1]].is_mine = true;
                    i++
                }
            }
        }
        return board
    }

    seek_mines_around(board:Cell[][], row:number, column:number){
        const mine_search:number[][] = [[-1, 1],
                                        [0,  1],
                                        [1,  1],
                                        [-1, 0],
                                        [1,  0],
                                        [-1,-1],
                                        [0, -1],
                                        [1, -1]]
                                        
        for(let i = 0; i < row ; i++){
            for(let j = 0; j < column; j++){
                let mines : number = 0
                for(const seeker of mine_search){
                    if(i + seeker[0] < 0 || j + seeker[1] < 0 || i + seeker[0] > row || j + seeker[1] > column){
                        continue
                    }
                    if (
                        board[i + seeker[0]] &&
                        board[i + seeker[0]][j + seeker[1]] &&
                        board[i + seeker[0]][j + seeker[1]].is_mine
                        ) {
                            mines++;
                        }

                }
                board[i][j].mines_around = mines;
            }
        }
        return board;
    }

    openCell(board: Cell[][], row: number, column: number, rows: number, columns: number, cellsGame: any, PnumberOfFlags: any) : void {
        if((row < 0 || column < 0 || row > rows || column > columns)|| board[row][column].state == 'open' || board[row][column].is_mine){
            return;
        }
        else if(board[row][column].mines_around != 0){
            if(board[row][column].state == 'flag'){
                PnumberOfFlags.flags += 1;
            }
            board[row][column].state = 'open';
            cellsGame.cellsOpened += 1;
        }
        else if(board[row][column].mines_around == 0){
    
            if(board[row][column].state == 'flag'){
                PnumberOfFlags.flags += 1;
            }
            board[row][column].state = 'open';
            cellsGame.cellsOpened += 1;
            this.openCell(board, row + 1, column, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row - 1, column, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row, column + 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row, column - 1, rows, columns, cellsGame, PnumberOfFlags);

            this.openCell(board, row + 1, column + 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row - 1, column - 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row - 1, column + 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row + 1, column - 1, rows, columns, cellsGame, PnumberOfFlags);
        }
    }

    flag(cell: Cell) : void{
        if(cell.state == 'closed'){
            cell.state = 'flag';
        }
        else if(cell.state == 'flag'){
            cell.state = 'closed';
        }
    }
}