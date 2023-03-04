import { Injectable } from '@angular/core';
import { Board } from 'src/types/Board';
import { Piece } from 'src/types/Piece';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor() { }
  row: number = 0;
  col: number = 0;
  stepLength: number = 0;
  straightSteps: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  diagSteps: number[][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  knightSteps: number[][] = [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]];

  getPieces() {
    return {
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
      10:{
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

  addPawnMoves(board: Board, pieceNumber: number, dirMult: number) {
    //we add the potential move
    if(!board.pieces[dirMult * 8 + pieceNumber]) {
      board.highlightedCells.add(dirMult * 8 + pieceNumber)
      //we add the possibility of jumping 2 squares on the first move
      if(this.onFirstRank(pieceNumber, dirMult) && !board.pieces[dirMult * 16 + pieceNumber]) {
        board.highlightedCells.add(dirMult * 16 + pieceNumber)
      }
    }
    //we add the potential captures

    if(this.pawnCanCapture(board.pieces, board.enPassant, pieceNumber, dirMult, 7)) {
      board.highlightedCells.add(dirMult * 7 + pieceNumber);
    }

    if(this.pawnCanCapture(board.pieces, board.enPassant, pieceNumber, dirMult, 9)) {
      board.highlightedCells.add(dirMult * 9 + pieceNumber);
    }
  }
  pawnCanCapture(pieces: {[key: number]: Piece}, enPassant: number, pieceNumber: number, dirMult: number, increment: number) {
    return (
      Math.abs(pieceNumber - enPassant) === 1 ||
      (pieces[dirMult * increment + pieceNumber]
      && pieces[dirMult * increment + pieceNumber].color !== pieces[pieceNumber].color)
    );
  }

  onFirstRank(pieceNumber: number, dirMult: number) {
    return (dirMult > 0 && pieceNumber < 17) || (dirMult < 0 && pieceNumber > 48);
  }

  addRookMoves(board: Board, pieceNumber: number) {
    this.row = Math.floor((pieceNumber - 1) / 8) + 1;
    this.col = (pieceNumber - 1) % 8 + 1;
    this.straightSteps.forEach(step => {
      this.stepLength = 1;
      while(true) {
        if(this.inRangeAndAvailable(board.pieces, this.row + this.stepLength * step[0], this.col + this.stepLength * step[1], board.pieces[pieceNumber].color)) {
          board.highlightedCells.add((this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]);
          if(board.pieces[(this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]]) {
            break;
          }
          this.stepLength++;
        } else {
          break;
        }
      }
    })
  }
  addKnightMoves(board: Board, pieceNumber: number) {
    this.row = Math.floor((pieceNumber - 1) / 8) + 1;
    this.col = (pieceNumber - 1) % 8 + 1;
    this.knightSteps.forEach(step => {
      if(this.inRangeAndAvailable(board.pieces, this.row + step[0], this.col + step[1], board.pieces[pieceNumber].color)) {
        board.highlightedCells.add((this.row + step[0] - 1) * 8 + this.col + step[1]);
      }
    })
  }
  addBishopMoves(board: Board, pieceNumber: number) {
    this.row = Math.floor((pieceNumber - 1) / 8) + 1;
    this.col = (pieceNumber - 1) % 8 + 1;
    this.diagSteps.forEach(step => {
      this.stepLength = 1;
      while(true) {
        if(this.inRangeAndAvailable(board.pieces, this.row + this.stepLength * step[0], this.col + this.stepLength * step[1], board.pieces[pieceNumber].color)) {
          board.highlightedCells.add((this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]);
          if(board.pieces[(this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]]) {
            break;
          }
          this.stepLength++;
        } else {
          break;
        }
      }
    })
  }
  addQueenMoves(board: Board, pieceNumber: number) {
    this.row = Math.floor((pieceNumber - 1) / 8) + 1;
    this.col = (pieceNumber - 1) % 8 + 1;
    this.straightSteps.forEach(step => {
      this.stepLength = 1;
      while(true) {
        if(this.inRangeAndAvailable(board.pieces, this.row + this.stepLength * step[0], this.col + this.stepLength * step[1], board.pieces[pieceNumber].color)) {
          board.highlightedCells.add((this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]);
          if(board.pieces[(this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]]) {
            break;
          }
          this.stepLength++;
        } else {
          break;
        }
      }
    })
    this.diagSteps.forEach(step => {
      this.stepLength = 1;
      while(true) {
        if(this.inRangeAndAvailable(board.pieces, this.row + this.stepLength * step[0], this.col + this.stepLength * step[1], board.pieces[pieceNumber].color)) {
          board.highlightedCells.add((this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]);
          if(board.pieces[(this.row + this.stepLength * step[0] - 1) * 8 + this.col + this.stepLength * step[1]]) {
            break;
          }
          this.stepLength++;
        } else {
          break;
        }
      }
    })
  }

  addKingMoves(board: Board, pieceNumber: number) {
    this.row = Math.floor((pieceNumber - 1) / 8) + 1;
    this.col = (pieceNumber - 1) % 8 + 1;
    this.straightSteps.forEach(step => {
      if(this.inRangeAndAvailable(board.pieces, this.row + step[0], this.col + step[1], board.pieces[pieceNumber].color)) {
        board.highlightedCells.add((this.row + step[0] - 1) * 8 + this.col + step[1]);
      }
    })
    this.diagSteps.forEach(step => {
      if(this.inRangeAndAvailable(board.pieces, this.row + step[0], this.col + step[1], board.pieces[pieceNumber].color)) {
        board.highlightedCells.add((this.row + step[0] - 1) * 8 + this.col + step[1]);
      }
    })
  }
  inRangeAndAvailable(pieces: {[key: number]: Piece}, row: number, col: number, color: string) {
    return this.inRange(row, col) && this.isAvailable(pieces, row, col, color);
  }
  isAvailable(pieces: { [key: number]: Piece; }, row: number, col: number, color: string) {
    return !pieces[(row - 1) * 8 + col] || pieces[(row - 1) * 8 + col].color !== color;
  }
  inRange(row: number, col: number) {
    return row < 9 && row > 0 && col < 9 && col > 0;
  }
}