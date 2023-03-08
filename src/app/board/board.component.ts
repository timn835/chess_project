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
    this.boardService.syncPieces(this.currentBoard, this.futureBoard);
  }

  rows: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  cols: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  colsAsString: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

  //helper variables
  helperSet: Set<number> = new Set(); //general helper set
  wronglyHighlightedCells: Set<number> = new Set(); //helper set for wrongly selected cells
  pieceNums: string[] = []; //helper array to hold piece positions (as digit strings) that are keys in the pieces object
  pieceNums2: string[] = []; //other helper array, just like above
  kingCanBeCaptured: boolean = false;
  checkMate: boolean = false;
  //////////

  alertCheckMate: boolean = false;
  currentBoard: Board = {
    liveBoard: true,
    pieces: {},
    moveChain: [],
    turnToMove: "white",
    selectedPiece: 0,
    highlightPieceOnBoard: false,
    enPassant: 0,
    highlightedCells: new Set()
  };

  futureBoard: Board = {
    liveBoard: false,
    pieces: {},
    moveChain: [],
    turnToMove: "white",
    selectedPiece: 0,
    highlightPieceOnBoard: false,
    enPassant: 0,
    highlightedCells: new Set()
  };

  queenBoxActivated: boolean = false;
  queenRows!: Set<number>;
  queenRowsWhite: Set<number> = new Set([5, 6, 7, 8]);
  queenRowsBlack: Set<number> = new Set([1, 2, 3, 4]);
  queenColumn: number = 0;

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
    this.currentBoard.highlightPieceOnBoard = false;
    if(this.currentBoard.highlightedCells.has(squareNumber)) {
      this.movePiece(this.currentBoard, squareNumber);
      this.movePiece(this.futureBoard, squareNumber);
      this.pieceNums2 = Object.keys(this.currentBoard.pieces);
      this.checkMate = true;
      for(let i = 0; i < this.pieceNums2.length; i++) {
        if(this.currentBoard.pieces[parseInt(this.pieceNums2[i])].color === this.currentBoard.turnToMove) {
          // this.clearSelection(this.currentBoard);
          // this.clearSelection(this.futureBoard);
          this.selectAndTrim(this.currentBoard, this.futureBoard, parseInt(this.pieceNums2[i]));
          if(this.currentBoard.highlightedCells.size) {
            this.checkMate = false;
            break;
          }
        }
      }
      if(this.checkMate) {
        this.alertCheckMate = true;
      }
    }
    else if(this.currentBoard.pieces[squareNumber] && this.currentBoard.turnToMove === this.currentBoard.pieces[squareNumber].color) {
      console.log("hi");
      console.log(this.currentBoard.pieces);
      console.log(this.futureBoard.pieces);
      this.selectAndTrim(this.currentBoard, this.futureBoard, squareNumber);
      this.currentBoard.highlightPieceOnBoard = true;
    }
    else {
      this.clearSelection(this.currentBoard);
      this.clearSelection(this.futureBoard);
    }
  }

  movePiece(board: Board, moveTo: number) {
    board.moveChain.push({
      movedPiece: board.pieces[board.selectedPiece],
      queenedPiece: {name: "n", color: "n"},
      oldPieceNumber: board.selectedPiece,
      newPieceNumber: moveTo,
      capturedPiece: {name: "n", color: "n"},
      capturedPieceNumber: 0,
      enPassantAfterMove: 0
    });
    if(
      board.pieces[board.selectedPiece].name === "pawn" //we want to move a pawn
      && Math.abs(moveTo - board.selectedPiece) % 8 //we want to move diagonally
      && !board.pieces[moveTo] //there is no piece to capture on a diagonal square
    ) {
      board.moveChain[board.moveChain.length - 1].capturedPieceNumber = board.enPassant;
      board.moveChain[board.moveChain.length - 1].capturedPiece = board.pieces[board.enPassant];
      delete board.pieces[board.enPassant];
    }
    if(board.pieces[moveTo]) {
      board.moveChain[board.moveChain.length - 1].capturedPieceNumber = moveTo;
      board.moveChain[board.moveChain.length - 1].capturedPiece = board.pieces[moveTo];
    }
    board.pieces[moveTo] = board.pieces[board.selectedPiece];
    if(board.pieces[moveTo].name === "pawn" && Math.abs(moveTo - board.selectedPiece) === 16) {
      board.enPassant = moveTo;
      board.moveChain[board.moveChain.length - 1].enPassantAfterMove = moveTo;
    } else {
      board.enPassant = 0;
    }
    delete board.pieces[board.selectedPiece];
    this.clearSelection(board);
    if(board.liveBoard && board.pieces[moveTo].name === "pawn" && (moveTo > 56 || moveTo < 9)) {
      this.queenRows = board.pieces[moveTo].color === "white" ?
        this.queenRowsWhite : this.queenRowsBlack;
      this.queenColumn = (moveTo - 1) % 8 + 1;
      delete board.pieces[moveTo];
      this.queenBoxActivated = true;
    }
    board.turnToMove = board.turnToMove === "white" ? "black" : "white";
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
    this.currentBoard.moveChain[this.currentBoard.moveChain.length - 1].queenedPiece = piece;
    this.queenBoxActivated = false;
  }

  hasLegalMoves() {
    return true;
  }

  isInCheck() {
    return true;
  }

  takebackMove(board: Board) {
    if(!board.moveChain.length) {
      return;
    }
    //put the moved piece to the original square
    //in case of queening, movedPiece will still be a pawn, promoted piece is stored in queenedPiece
    board.pieces[board.moveChain[board.moveChain.length - 1].oldPieceNumber] = board.moveChain[board.moveChain.length - 1].movedPiece;
    //remove the moved piece from the moved-to-square
    delete board.pieces[board.moveChain[board.moveChain.length - 1].newPieceNumber];
    //if there was a capture, put the captured piece back on the board
    if(board.moveChain[board.moveChain.length - 1].capturedPieceNumber) {
      board.pieces[board.moveChain[board.moveChain.length - 1].capturedPieceNumber] = board.moveChain[board.moveChain.length - 1].capturedPiece
    }
    board.turnToMove = board.turnToMove === "white" ? "black" : "white";
    board.moveChain.pop();
    this.clearSelection(board);
    if(board.moveChain.length) {
      board.enPassant = board.moveChain[board.moveChain.length - 1].enPassantAfterMove;
    } else {
      board.enPassant = 0;
    }
  }

  takeBackOnBoard() {
    this.takebackMove(this.currentBoard);
    this.takebackMove(this.futureBoard);
    if(this.alertCheckMate) {
      this.alertCheckMate = false;
    }
  }

  selectAndTrim(currentBoard: Board, futureBoard: Board, squareNumber: number) {
    this.selectPiece(currentBoard, squareNumber);
    currentBoard.highlightedCells.forEach(moveTo => {
      this.selectPiece(futureBoard, squareNumber);
      this.movePiece(futureBoard, moveTo);
      this.pieceNums = Object.keys(futureBoard.pieces);
      for(let i = 0; i < this.pieceNums.length; i++) {
        if(futureBoard.pieces[parseInt(this.pieceNums[i])].color === futureBoard.turnToMove) {
          this.selectPiece(futureBoard, parseInt(this.pieceNums[i]));
          futureBoard.highlightedCells.forEach(cell => {
            if(futureBoard.pieces[cell] && futureBoard.pieces[cell].name === "king") {
              this.kingCanBeCaptured = true;
            }
          });
        }
        if(this.kingCanBeCaptured) {
          break;
        }
      }
      if(this.kingCanBeCaptured) {
        this.wronglyHighlightedCells.add(moveTo);
        this.kingCanBeCaptured = false;
      }
      this.takebackMove(futureBoard);
    });
    this.wronglyHighlightedCells.forEach(wrongSquare => {
      currentBoard.highlightedCells.delete(wrongSquare);
    });
    this.wronglyHighlightedCells.clear();
    this.selectPiece(futureBoard, squareNumber);
  }
}
