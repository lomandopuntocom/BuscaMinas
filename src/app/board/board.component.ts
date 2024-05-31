import { Component } from '@angular/core';
import { CellService } from '../Services/Cell.Service';
import { Cell } from '../Models/Cell';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  board: Cell[][];
  cellsGame: any;
  boardActive: boolean;
  numberOfFlags: any;
  rows: number;
  columns: number;

  constructor(private cellService: CellService) {
    this.board = [];
    this.cellsGame = { cellsOpened: 0, cells: 0, numberMines: 0 };
    this.numberOfFlags = { flags: 0 };
    this.rows = 0;
    this.columns = 0;
    this.boardActive = true;
  }

  createBoard(rows: number, columns: number) {
    console.log(rows, columns)
    const minesNumber = rows + columns;
    this.board = this.cellService.make_board(columns, rows, minesNumber);
    this.cellsGame = {cells: rows * columns, minesNumber: minesNumber}
    this.boardActive = true;
  }

  cellClicked(row: number, column: number) {
    console.log(row, column)
    const cell = this.board[row][column];
    
    if (cell.state === 'closed') {
      this.cellService.openCell(this.board, row, column, this.rows, this.columns, this.cellsGame, this.numberOfFlags);
      
      if (cell.is_mine && cell.mines_around === 0) {
        cell.state = 'open';
        this.cellsGame.cellsOpened++;
      }
    }
    
    if (this.cellsGame.cellsOpened >= this.cellsGame.cells - this.cellsGame.numberMines) {
      this.boardActive = false
    } else if (cell.is_mine) {
      this.boardActive = false;
  
    }
  }

  
  

  flagCell(row: number, column: number) {
    const cell = this.board[row][column];
    this.cellService.flag(cell);

    if (cell.state === 'flag') {
      this.numberOfFlags.flags += 1;
    } else if (cell.state === 'closed') {
      this.numberOfFlags.flags -= 1;
    }
  }

  
}
