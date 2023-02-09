import { Component } from '@angular/core';
import { Piece } from 'src/types/Piece';
import { Square } from 'src/types/Square';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  constructor(private boardService: BoardService) {
  }
  ngOnInit(): void {
    // this.board = this.booksService.getBooks();
  }
  rows: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  cols: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  colsAsString: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

  board: {[key: number]: Piece} = {
    1:{
      color: "white",
      name: "rook"
    },
    2:{
      color: "white",
      name: "knight"
    },
    3:{
      color: "white",
      name: "bishop"
    },
    4:{
      color: "white",
      name: "queen"
    },
    5:{
      color: "white",
      name: "king"
    },
    9:{
      color: "white",
      name: "pawn"
    },
    57:{
      color: "black",
      name: "rook"
    },
    58:{
      color: "black",
      name: "knight"
    },
    59:{
      color:"black",
      name: "bishop"
    },
    60:{
      color: "black",
      name: "queen"
    },
    61:{
      color: "black",
      name: "king"
    },
    49:{
      color: "black",
      name: "pawn"
    },
  };
}
