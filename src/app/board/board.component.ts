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
  turnToMove: string = "white";
  selectedPiece: number = 0;
  highlightedCells: Set<number> = new Set();
  enPassant: number = 0;
  queenBoxActivated: boolean = false;
  queenRows!: Set<number>;
  queenRowsWhite: Set<number> = new Set([5, 6, 7, 8]);
  queenRowsBlack: Set<number> = new Set([1, 2, 3, 4]);
  queenColumn: number = 0;

  selectPiece(pieceNumber: number) {
    this.selectedPiece = pieceNumber;
    this.highlightedCells.clear();
    this.addPotentialMoves(pieceNumber)
  }

  addPotentialMoves(pieceNumber: number) {
    if(this.pieces[pieceNumber].name === "pawn") {
      this.boardService.addPawnMoves(this.pieces, this.highlightedCells, this.enPassant, pieceNumber, this.pieces[pieceNumber].color === "white" ? 1 : -1);
    } else if (this.pieces[pieceNumber].name === "rook") {
      this.boardService.addRookMoves(pieceNumber);
    } else if (this.pieces[pieceNumber].name === "knight") {
      this.boardService.addKnightMoves(pieceNumber);
    } else if (this.pieces[pieceNumber].name === "bishop") {
      this.boardService.addBishopMoves(pieceNumber);
    } else if (this.pieces[pieceNumber].name === "queen") {
      this.boardService.addQueenMoves(pieceNumber);
    } else {
      this.boardService.addKingMoves(pieceNumber);
    }
  }

  squareClicked(squareNumber: number) {
    if(this.highlightedCells.has(squareNumber)) {
      if(
        this.pieces[this.selectedPiece].name === "pawn" //we want to move a pawn
        && Math.abs(squareNumber - this.selectedPiece) % 8 //we want to move diagonally
        && !this.pieces[squareNumber] //there is no piece to capture on a diagonal square
      ) {
        delete this.pieces[this.enPassant]
      }
      this.pieces[squareNumber] = this.pieces[this.selectedPiece];
      if(this.pieces[squareNumber].name === "pawn" && Math.abs(squareNumber - this.selectedPiece) === 16) {
        this.enPassant = squareNumber;
      } else {
        this.enPassant = 0;
      }
      delete this.pieces[this.selectedPiece];
      this.clearSelection();
      if(this.pieces[squareNumber].name === "pawn" && (squareNumber > 56 || squareNumber < 9)) {
        this.queenRows = this.pieces[squareNumber].color === "white" ?
          this.queenRowsWhite : this.queenRowsBlack;
        this.queenColumn = (squareNumber - 1) % 8 + 1;
        this.queenBoxActivated = true;
      }
      this.turnToMove = this.turnToMove === "white" ? "black" : "white";
    }
    else if(this.pieces[squareNumber] && this.turnToMove === this.pieces[squareNumber].color) {
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

  onPromotionSelection(piece:Piece) {
    if(piece.color === "white") {
      this.pieces[56 + this.queenColumn] = piece;
    } else {
      this.pieces[this.queenColumn] = piece;
    }
    this.queenBoxActivated = false;
  }
}
