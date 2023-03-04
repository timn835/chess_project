import { Component } from '@angular/core';
import { Piece } from 'src/types/Piece';
import { Board } from 'src/types/Board';
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
    this.currentBoard.pieces = this.boardService.getPieces();
  }

  rows: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  cols: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  colsAsString: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
  currentBoard: Board = {
    pieces: {},
    turnToMove: "white",
    selectedPiece: 0,
    enPassant: 0,
    highlightedCells: new Set()
  };
  futurePieces: {[key: number]: Piece} = {};

  // turnToMove: string = "white";
  // selectedPiece: number = 0;
  // highlightedCells: Set<number> = new Set();
  // futureHighlightedCells: Set<number> = new Set();
  // enPassant: number = 0;
  //variables for pawn queening functionality
  queenBoxActivated: boolean = false;
  queenRows!: Set<number>;
  queenRowsWhite: Set<number> = new Set([5, 6, 7, 8]);
  queenRowsBlack: Set<number> = new Set([1, 2, 3, 4]);
  queenColumn: number = 0;
  //variables for checking logic

  selectPiece(board: Board, pieceNumber: number) {
    board.selectedPiece = pieceNumber;
    board.highlightedCells.clear();
    this.addPotentialMoves(board, pieceNumber)
  }

  addPotentialMoves(board: Board, pieceNumber: number) {
    if(board.pieces[pieceNumber].name === "pawn") {
      this.boardService.addPawnMoves(board, pieceNumber, board.pieces[pieceNumber].color === "white" ? 1 : -1);
    } else if (board.pieces[pieceNumber].name === "rook") {
      this.boardService.addRookMoves(board, pieceNumber);
    } else if (board.pieces[pieceNumber].name === "knight") {
      this.boardService.addKnightMoves(board, pieceNumber);
    } else if (board.pieces[pieceNumber].name === "bishop") {
      this.boardService.addBishopMoves(board, pieceNumber);
    } else if (board.pieces[pieceNumber].name === "queen") {
      this.boardService.addQueenMoves(board, pieceNumber);
    } else {
      this.boardService.addKingMoves(board, pieceNumber);
    }
  }

  squareClicked(squareNumber: number) {
    if(this.currentBoard.highlightedCells.has(squareNumber)) {
      this.movePiece(this.currentBoard, squareNumber);
    }
    else if(this.currentBoard.pieces[squareNumber] && this.currentBoard.turnToMove === this.currentBoard.pieces[squareNumber].color) {
      this.selectPiece(this.currentBoard, squareNumber);
    }
    else {
      this.clearSelection(this.currentBoard);
    }
  }

  movePiece(board: Board, moveTo: number) {
    if(
      board.pieces[board.selectedPiece].name === "pawn" //we want to move a pawn
      && Math.abs(moveTo - board.selectedPiece) % 8 //we want to move diagonally
      && !board.pieces[moveTo] //there is no piece to capture on a diagonal square
    ) {
      delete board.pieces[board.enPassant]
    }
    board.pieces[moveTo] = board.pieces[board.selectedPiece];
    if(board.pieces[moveTo].name === "pawn" && Math.abs(moveTo - board.selectedPiece) === 16) {
      board.enPassant = moveTo;
    } else {
      board.enPassant = 0;
    }
    delete board.pieces[board.selectedPiece];
    this.clearSelection(board);
    if(board.pieces[moveTo].name === "pawn" && (moveTo > 56 || moveTo < 9)) {
      this.queenRows = board.pieces[moveTo].color === "white" ?
        this.queenRowsWhite : this.queenRowsBlack;
      this.queenColumn = (moveTo - 1) % 8 + 1;
      delete board.pieces[moveTo];
      this.queenBoxActivated = true;
    }
    board.turnToMove = board.turnToMove === "white" ? "black" : "white";
    // if(!this.hasLegalMoves()) {
    //   if(this.isInCheck()) {
    //     alert("checkmate");
    //   } else {
    //     alert("stalemate");
    //   }
    // } 
  }

  clearSelection(board: Board) {
    board.selectedPiece = 0
    board.highlightedCells.clear();
  }

  onPromotionSelection(piece:Piece) {
    if(piece.color === "white") {
      this.currentBoard.pieces[56 + this.queenColumn] = piece;
    } else {
      this.currentBoard.pieces[this.queenColumn] = piece;
    }
    this.queenBoxActivated = false;
  }

  hasLegalMoves() {
    return true;
  }

  isInCheck() {
    return true;
  }

}
