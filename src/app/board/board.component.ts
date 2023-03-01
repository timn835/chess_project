import { Component } from '@angular/core';
import { Piece } from 'src/types/Piece';
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
    this.pieces = this.boardService.getPosition();
  }
  rows: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  cols: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  colsAsString: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
  pieces: {[key: number]: Piece} = {};
  selectedPiece: number = 0;
  highlightedCells: any = new Set();

  // onPieceClicked(data:number[]) {
    // if(this.selectedPiece) {
    //   this.move(this.selectedPiece, (data[0] - 1) * 8 + data[1])
    // } else {
    //   console.log("else statement")
    //   this.selectPiece((data[0] - 1) * 8 + data[1])
    // }
    // delete this.board[(data[0] - 1) * 8 + data[1]]
  // }

  selectPiece(pieceNumber: number) {
    this.selectedPiece = pieceNumber;
    this.highlightedCells.clear();
    this.highlightedCells.add(pieceNumber + 8);
    this.addPotentialMoves(pieceNumber)
  }

  addPotentialMoves(pieceNumber: number) {
    if(this.pieces[pieceNumber].name === "pawn") {
      this.addPawnMoves(pieceNumber);
    } else if (this.pieces[pieceNumber].name === "rook") {
      this.addRookMoves(pieceNumber);
    } else if (this.pieces[pieceNumber].name === "knight") {
      this.addKnightMoves(pieceNumber);
    } else if (this.pieces[pieceNumber].name === "bishop") {
      this.addBishopMoves(pieceNumber);
    } else if (this.pieces[pieceNumber].name === "queen") {
      this.addQueenMoves(pieceNumber);
    } else {
      this.addKingMoves(pieceNumber);
    }
  }

  squareClicked(squareNumber: number) {
    if(this.highlightedCells.has(squareNumber)) {
      this.pieces[squareNumber] = this.pieces[this.selectedPiece];
      delete this.pieces[this.selectedPiece];
      this.clearSelection();
    }
    else if(this.pieces[squareNumber]) {
      this.selectPiece(squareNumber);
    }
    else {
      this.clearSelection();
    }
  }
  clearSelection() {
    this.selectedPiece = 0
    this.highlightedCells.clear();
  }
  addPawnMoves(pieceNumber: number) {
    if(this.pieces[pieceNumber].color === "white") {
      this.highlightedCells.add(pieceNumber + 8);
      if(pieceNumber < 17) {
        this.highlightedCells.add(pieceNumber + 16)
      }
    } else {
      this.highlightedCells.add(pieceNumber - 8);
      if(pieceNumber > 48) {
        this.highlightedCells.add(pieceNumber - 16)
      }
    }
  }
  addRookMoves(pieceNumber: number) {

  }
  addKnightMoves(pieceNumber: number) {

  }
  addBishopMoves(pieceNumber: number) {

  }
  addQueenMoves(pieceNumber: number) {

  }
  addKingMoves(pieceNumber: number) {

  }
}
