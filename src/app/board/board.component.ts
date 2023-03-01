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
  highlightedCells: any = new Set();
  enPassant: number = 0;

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
    this.addPotentialMoves(pieceNumber)
  }

  addPotentialMoves(pieceNumber: number) {
    if(this.pieces[pieceNumber].name === "pawn") {
      this.addPawnMoves(pieceNumber, this.pieces[pieceNumber].color === "white" ? 1 : -1);
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

  addPawnMoves(pieceNumber: number, dirMult: number) {
    //we add the potential move
    if(!this.pieces[dirMult * 8 + pieceNumber]) {
      this.highlightedCells.add(dirMult * 8 + pieceNumber)
      //we add the possibility of jumping 2 squares on the first move
      if(this.onFirstRank(pieceNumber, dirMult) && !this.pieces[dirMult * 16 + pieceNumber]) {
        this.highlightedCells.add(dirMult * 16 + pieceNumber)
      }
    }
    //we add the potential captures

    if(this.pawnCanCapture(pieceNumber, dirMult, 7)) {
      this.highlightedCells.add(dirMult * 7 + pieceNumber);
    }

    if(this.pawnCanCapture(pieceNumber, dirMult, 9)) {
      this.highlightedCells.add(dirMult * 9 + pieceNumber);
    }
  }
  pawnCanCapture(pieceNumber: number, dirMult: number, increment: number) {
    return (
      Math.abs(pieceNumber - this.enPassant) === 1 ||
      (this.pieces[dirMult * increment + pieceNumber]
      && this.pieces[dirMult * increment + pieceNumber].color !== this.pieces[pieceNumber].color)
    );
  }

  onFirstRank(pieceNumber: number, dirMult: number) {
    return (dirMult > 0 && pieceNumber < 17) || (dirMult < 0 && pieceNumber > 48);
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
