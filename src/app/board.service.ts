import { Injectable } from '@angular/core';
import { Board } from 'src/types/Board';
import { Move } from 'src/types/Move';
import { Piece } from 'src/types/Piece';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor() { }
  row: number = 0;
  col: number = 0;
  helperSet: Set<number> = new Set();
  stepLength: number = 0;
  straightSteps: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  diagSteps: number[][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  knightSteps: number[][] = [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]];
  castlingRightColumn = 7;
  castlingLeftColumn = 3;

  pieceNums: string[] = []; //helper array to hold piece positions (as digit strings) that are keys in the pieces object
  pieceNums2: string[] = []; //other helper array, just like above
  canCastle: boolean = true; //helper boolean variable for castling

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
      8:{
        color: "white",
        name: "rook"
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
      64:{
        color: "black",
        name: "rook"
      }
    };
  }

  setInitialKingColumn(board: Board) {
    for(let i = 1; i < 9; i++) {
      if(board.pieces[i].name === "king") {
        board.initialKingColumn = i;
        return;
      }
    }
  }

  setInitialLeftRookColumn(board: Board) {
    for(let i = board.initialKingColumn - 1; i > 0; i--) {
      if(board.pieces[i].name === "rook") {
        board.initialLeftRookColumn = i;
        return;
      }
    }
  }

  setInitialRightRookColumn(board: Board) {
    for(let i = board.initialKingColumn + 1; i < 9; i++) {
      if(board.pieces[i].name === "rook") {
        board.initialRightRookColumn = i;
        return;
      }
    }
  }

  syncPieces(currentBoard: Board, futureBoard: Board) {
    Object.keys(currentBoard.pieces).forEach(key => {
      futureBoard.pieces[parseInt(key)] = currentBoard.pieces[parseInt(key)];
    });
    Object.keys(futureBoard.pieces).forEach(key => {
      if(!currentBoard.pieces[parseInt(key)]) {
        this.helperSet.add(parseInt(key));
      }
    });
    this.helperSet.forEach(key => {
      delete futureBoard.pieces[key];
    });
    this.helperSet.clear();
  }

  selectPiece(board: Board, pieceNumber: number) {
    board.selectedPiece = pieceNumber;
    board.highlightedCells.clear();
    this.addPotentialMoves(board, pieceNumber)
  }

  clearSelection(board: Board) {
    board.selectedPiece = 0
    board.highlightedCells.clear();
  }

  addPotentialMoves(board: Board, pieceNumber: number) {
    if(board.pieces[pieceNumber].name === "pawn") {
      this.addPawnMoves(board, pieceNumber, board.pieces[pieceNumber].color === "white" ? 1 : -1);
    } else if (board.pieces[pieceNumber].name === "rook") {
      this.addRookMoves(board, pieceNumber);
    } else if (board.pieces[pieceNumber].name === "knight") {
      this.addKnightMoves(board, pieceNumber);
    } else if (board.pieces[pieceNumber].name === "bishop") {
      this.addBishopMoves(board, pieceNumber);
    } else if (board.pieces[pieceNumber].name === "queen") {
      this.addQueenMoves(board, pieceNumber);
    } else {
      this.addKingMoves(board, pieceNumber);
    }
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

    if(board.pieces[pieceNumber].color === "white") {
      // if(board.whiteCanCastleRight) {
      if(this.whiteCanCastleRight(board)) {
        board.highlightedCells.add(board.initialRightRookColumn);
      }
      if(this.whiteCanCastleLeft(board)) {
        board.highlightedCells.add(board.initialLeftRookColumn);
      }
    } else {
      if(this.blackCanCastleRight(board)) {
        board.highlightedCells.add(board.initialRightRookColumn);
      }
      if(this.blackCanCastleLeft(board)) {
        board.highlightedCells.add(board.initialLeftRookColumn);
      }
    }
  }

  inRangeAndAvailable(pieces: {[key: number]: Piece}, row: number, col: number, color: string) {
    return this.inRange(row, col) && this.isAvailable(pieces, row, col, color);
  }

  isAvailable(pieces: { [key: number]: Piece; }, row: number, col: number, color: string) {
    return !pieces[(row - 1) * 8 + col] || pieces[(row - 1) * 8 + col].color !== color;
  }

  inRange(row: number, col: number): boolean {
    return row < 9 && row > 0 && col < 9 && col > 0;
  }

  //helper functions for castling

  whiteCanCastleRight(board: Board): boolean {
    if(!board.whiteCanCastleRight) {
      return false;
    }
    for(let i = Math.min(board.initialKingColumn, 6, 7); i <= Math.max(board.initialKingColumn, 6, 7); i++) {
      if(i !== board.initialRightRookColumn && i !== board.initialKingColumn && board.pieces[i]) {
        return false;
      }
    }
    return true;
  }

  whiteCanCastleLeft(board: Board): boolean {
    if(!board.whiteCanCastleLeft) {
      return false;
    }
    return true;
  }

  blackCanCastleRight(board: Board): boolean {
    if(!board.blackCanCastleRight) {
      return false;
    }
    return true;
  }

  blackCanCastleLeft(board: Board): boolean {
    if(!board.blackCanCastleLeft) {
      return false;
    }
    return true;
  }

  canSquareGetHit(board: Board, squareNumber: number): boolean {
    board.turnToMove = board.turnToMove === "white" ? "black" : "white";
    this.pieceNums2 = Object.keys(board.pieces);
    for(let i = 0; i < this.pieceNums2.length; i++) {
      if(board.pieces[parseInt(this.pieceNums2[i])].color === board.turnToMove) {
        this.selectPiece(board, parseInt(this.pieceNums2[i]));
        if(board.highlightedCells.has(squareNumber)) {
          board.turnToMove = board.turnToMove === "white" ? "black" : "white";
          this.clearSelection(board);
          return true;
        }
      }
    }
    board.turnToMove = board.turnToMove === "white" ? "black" : "white";
    this.clearSelection(board);
    return false;
  }

  updateCastlingRights(board: Board, move: Move) {
    if(board.pieces[board.selectedPiece].name === "king") {
      board.whiteCanCastleLeft = false;
      board.whiteCanCastleRight = false;
      board.blackCanCastleLeft = false;
      board.blackCanCastleRight = false;
    }
    else if(board.pieces[board.selectedPiece].name === "rook") {
      if(board.selectedPiece < board.initialKingColumn) {
        if(board.whiteCanCastleLeft && board.pieces[board.selectedPiece].color === "white") {
          board.whiteCanCastleLeft = false;
        } else if(board.blackCanCastleLeft && board.pieces[board.selectedPiece].color === "black") {
          board.blackCanCastleLeft = false;
        }
      } else if(board.selectedPiece > board.initialKingColumn) {
        if(board.whiteCanCastleRight && board.pieces[board.selectedPiece].color === "white") {
          board.whiteCanCastleRight = false;
        } else if(board.blackCanCastleRight && board.pieces[board.selectedPiece].color === "black") {
          board.blackCanCastleRight = false;
        }
      }
    }
    move.whiteCanCastleRightAfterMove = board.whiteCanCastleRight;
    move.whiteCanCastleLeftAfterMove = board.whiteCanCastleLeft;
    move.blackCanCastleRightAfterMove = board.blackCanCastleRight;
    move.blackCanCastleLeftAfterMove = board.blackCanCastleLeft;
  }

}