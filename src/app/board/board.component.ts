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
    this.boardService.setInitialKingColumn(this.currentBoard);
    this.boardService.setInitialLeftRookColumn(this.currentBoard);
    this.boardService.setInitialRightRookColumn(this.currentBoard);
    this.futureBoard.initialKingColumn = this.currentBoard.initialKingColumn;
    this.futureBoard.initialLeftRookColumn = this.currentBoard.initialLeftRookColumn;
    this.futureBoard.initialRightRookColumn = this.currentBoard.initialRightRookColumn;
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
  check: boolean = false;
  mate: boolean = false;
  //////////

  alertCheckMate: boolean = false;
  currentBoard: Board = {
    liveBoard: true,
    pieces: {},
    moveChain: [],
    turnToMove: "white",
    initialKingColumn: 0,
    initialLeftRookColumn: 0,
    initialRightRookColumn: 0,
    whiteCanCastleLeft: true,
    whiteCanCastleRight: true,
    blackCanCastleLeft: true,
    blackCanCastleRight: true,
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
    initialKingColumn: 0,
    initialLeftRookColumn: 0,
    initialRightRookColumn: 0,
    whiteCanCastleLeft: true,
    whiteCanCastleRight: true,
    blackCanCastleLeft: true,
    blackCanCastleRight: true,
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

  squareClicked(squareNumber: number) {
    this.currentBoard.highlightPieceOnBoard = false;
    if(this.currentBoard.highlightedCells.has(squareNumber)) {
      this.movePiece(this.currentBoard, squareNumber);
      this.movePiece(this.futureBoard, squareNumber);
      //verify if it is check
      this.check = false;
      this.futureBoard.turnToMove = this.futureBoard.turnToMove === "white" ? "black" : "white";
      this.pieceNums2 = Object.keys(this.futureBoard.pieces);
      for(let i = 0; i < this.pieceNums2.length; i++) {
        if(this.futureBoard.pieces[parseInt(this.pieceNums2[i])].color === this.futureBoard.turnToMove) {
          this.boardService.selectPiece(this.futureBoard, parseInt(this.pieceNums2[i]));
          this.futureBoard.highlightedCells.forEach(cell => {
            if(this.futureBoard.pieces[cell] && this.futureBoard.pieces[cell].name === "king" && this.futureBoard.pieces[cell].color !== this.futureBoard.turnToMove) {
              this.check = true;
            }
          });
        }
        if(this.check) {
          break;
        }
      }
      this.futureBoard.turnToMove = this.futureBoard.turnToMove === "white" ? "black" : "white";

      //verify if it is mate
      this.pieceNums2 = Object.keys(this.currentBoard.pieces);
      this.mate = true;
      for(let i = 0; i < this.pieceNums2.length; i++) {
        if(this.currentBoard.pieces[parseInt(this.pieceNums2[i])].color === this.currentBoard.turnToMove) {
          this.selectAndTrim(this.currentBoard, this.futureBoard, parseInt(this.pieceNums2[i]));
          if(this.currentBoard.highlightedCells.size) {
            this.mate = false;
            break;
          }
        }
      }
      this.boardService.clearSelection(this.currentBoard);
      if(this.mate) {
        if(this.check) {
          console.log("checkmate");
        } else {
          console.log("stalemate");
        }
        // this.alertCheckMate = true;
      }
    }
    else if(this.currentBoard.pieces[squareNumber] && this.currentBoard.turnToMove === this.currentBoard.pieces[squareNumber].color) {
      if(this.currentBoard.selectedPiece === squareNumber) {
        this.boardService.clearSelection(this.currentBoard)
      } else {
        this.selectAndTrim(this.currentBoard, this.futureBoard, squareNumber);
        this.currentBoard.highlightPieceOnBoard = true;
        console.log(this.currentBoard.highlightedCells)
        console.log(this.currentBoard.enPassant)
      }
    }
    else {
      this.boardService.clearSelection(this.currentBoard);
      this.boardService.clearSelection(this.futureBoard);
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
      enPassantAfterMove: 0,
      hasJustCastled: false,
      whiteCanCastleLeftAfterMove: true,
      whiteCanCastleRightAfterMove: true,
      blackCanCastleLeftAfterMove: true,
      blackCanCastleRightAfterMove: true,
    });
    this.boardService.updateCastlingRights(board, board.moveChain[board.moveChain.length - 1]);

    if(
      board.pieces[board.selectedPiece].name === "pawn" //we want to move a pawn
      && Math.abs(moveTo - board.selectedPiece) % 8 //we want to move diagonally
      && !board.pieces[moveTo] //there is no piece to capture on a diagonal square
    ) {
      board.moveChain[board.moveChain.length - 1].capturedPieceNumber = board.enPassant;
      board.moveChain[board.moveChain.length - 1].capturedPiece = board.pieces[board.enPassant];
      delete board.pieces[board.enPassant];
    }

    if(board.pieces[moveTo] && board.pieces[moveTo].color !== board.turnToMove) {
      board.moveChain[board.moveChain.length - 1].capturedPieceNumber = moveTo;
      board.moveChain[board.moveChain.length - 1].capturedPiece = board.pieces[moveTo];
    }

    if(board.pieces[moveTo] && board.pieces[board.selectedPiece].color === board.pieces[moveTo].color) {
      //The only time when we move on a square of the same color is when we are castling
      //so this is a necessary and sufficient condition for castling
      //we do not even need to check if the piece at moveTo is a rook
      board.moveChain[board.moveChain.length - 1].hasJustCastled = true;

      if(board.turnToMove === "white") {
        if(moveTo > board.initialKingColumn) {
          //we are castling to the right with white
          board.pieces[7] = board.pieces[board.selectedPiece];
          board.pieces[6] = board.pieces[moveTo];
          if(board.initialKingColumn !== 7) {
            delete board.pieces[board.initialKingColumn];
          }
          if(board.initialRightRookColumn !== 6) {
            delete board.pieces[board.initialRightRookColumn];
          }
          board.moveChain[board.moveChain.length - 1].newPieceNumber = 7;
        } else {
          //we are castling to the left with white
          board.pieces[3] = board.pieces[board.selectedPiece];
          board.pieces[4] = board.pieces[moveTo];
          if(board.initialKingColumn !== 3) {
            delete board.pieces[board.initialKingColumn];
          }
          if(board.initialLeftRookColumn !== 4) {
            delete board.pieces[board.initialLeftRookColumn];
          }
          board.moveChain[board.moveChain.length - 1].newPieceNumber = 3;
        }
      } else {
        if(moveTo - 56 > board.initialKingColumn) {
          //we are castling to the right with black
          board.pieces[63] = board.pieces[board.selectedPiece];
          board.pieces[62] = board.pieces[moveTo];
          if(board.initialKingColumn !== 7) {
            delete board.pieces[board.initialKingColumn + 56];
          }
          if(board.initialRightRookColumn !== 6) {
            delete board.pieces[board.initialRightRookColumn + 56];
          }
          board.moveChain[board.moveChain.length - 1].newPieceNumber = 63;
        } else {
          //we are castling to the left with black
          board.pieces[59] = board.pieces[board.selectedPiece];
          board.pieces[60] = board.pieces[moveTo];
          if(board.initialKingColumn !== 3) {
            delete board.pieces[board.initialKingColumn + 56];
          }
          if(board.initialLeftRookColumn !== 4) {
            delete board.pieces[board.initialLeftRookColumn + 56];
          }
          board.moveChain[board.moveChain.length - 1].newPieceNumber = 59;
        }
      }
    } else {
      board.pieces[moveTo] = board.pieces[board.selectedPiece];
      if(board.pieces[moveTo].name === "pawn" && Math.abs(moveTo - board.selectedPiece) === 16) {
        board.enPassant = moveTo;
        board.moveChain[board.moveChain.length - 1].enPassantAfterMove = moveTo;
      } else {
        board.enPassant = 0;
      }
      delete board.pieces[board.selectedPiece];
    }


    
    this.boardService.clearSelection(board);
    if(board.liveBoard && board.pieces[moveTo] && board.pieces[moveTo].name === "pawn" && (moveTo > 56 || moveTo < 9)) {
      this.queenRows = board.pieces[moveTo].color === "white" ?
        this.queenRowsWhite : this.queenRowsBlack;
      this.queenColumn = (moveTo - 1) % 8 + 1;
      delete board.pieces[moveTo];
      this.queenBoxActivated = true;
    }
    board.turnToMove = board.turnToMove === "white" ? "black" : "white";
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

  takebackMove(board: Board) {
    if(!board.moveChain.length) {
      return;
    }
    //put the moved piece to the original square
    //in case of queening, movedPiece will still be a pawn, promoted piece is stored in queenedPiece
    board.pieces[board.moveChain[board.moveChain.length - 1].oldPieceNumber] = board.moveChain[board.moveChain.length - 1].movedPiece;
    //if the newPieceNumber and the oldPiece number are different (relevant for castling),
    //remove the moved piece from the moved-to-square
    if(board.moveChain[board.moveChain.length - 1].oldPieceNumber !== board.moveChain[board.moveChain.length - 1].newPieceNumber) {
      delete board.pieces[board.moveChain[board.moveChain.length - 1].newPieceNumber];
    }
    //if there was a capture, put the captured piece back on the board
    if(board.moveChain[board.moveChain.length - 1].hasJustCastled) {
      //we need to put the rook to it's square before castling
      if(board.moveChain[board.moveChain.length - 1].movedPiece.color === "white") {
        if(board.moveChain[board.moveChain.length - 1].newPieceNumber === 7) {
          if(board.initialRightRookColumn !== 6) {
            board.pieces[board.initialRightRookColumn] = board.pieces[6];
            delete board.pieces[6];
          }
        } else {
          if(board.initialLeftRookColumn !== 4) {
            board.pieces[board.initialLeftRookColumn] = board.pieces[4];
            delete board.pieces[4];
          }
        }
      } else {
        if(board.moveChain[board.moveChain.length - 1].newPieceNumber === 63) {
          if(board.initialRightRookColumn !== 6) {
            board.pieces[board.initialRightRookColumn + 56] = board.pieces[62];
            delete board.pieces[62];
          }
        } else {
          if(board.initialLeftRookColumn !== 4) {
            board.pieces[board.initialLeftRookColumn + 56] = board.pieces[60];
            delete board.pieces[60];
          }
        }
      }
    }
    if(board.moveChain[board.moveChain.length - 1].capturedPieceNumber) {
      board.pieces[board.moveChain[board.moveChain.length - 1].capturedPieceNumber] = board.moveChain[board.moveChain.length - 1].capturedPiece
    }
    board.turnToMove = board.turnToMove === "white" ? "black" : "white";
    board.moveChain.pop();
    this.boardService.clearSelection(board);
    if(board.moveChain.length) {
      board.enPassant = board.moveChain[board.moveChain.length - 1].enPassantAfterMove;
      board.whiteCanCastleLeft = board.moveChain[board.moveChain.length - 1].whiteCanCastleLeftAfterMove;
      board.whiteCanCastleRight = board.moveChain[board.moveChain.length - 1].whiteCanCastleRightAfterMove;
      board.blackCanCastleLeft = board.moveChain[board.moveChain.length - 1].blackCanCastleLeftAfterMove;
      board.blackCanCastleRight = board.moveChain[board.moveChain.length - 1].blackCanCastleRightAfterMove;
    } else {
      board.enPassant = 0;
      board.whiteCanCastleLeft = true;
      board.whiteCanCastleRight = true;
      board.blackCanCastleLeft = true;
      board.blackCanCastleRight = true;
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
    this.boardService.selectPiece(currentBoard, squareNumber);
    currentBoard.highlightedCells.forEach(moveTo => {
      this.boardService.selectPiece(futureBoard, squareNumber);
      this.movePiece(futureBoard, moveTo);

      this.pieceNums = Object.keys(futureBoard.pieces);
      for(let i = 0; i < this.pieceNums.length; i++) {
        if(futureBoard.pieces[parseInt(this.pieceNums[i])].color === futureBoard.turnToMove) {
          this.boardService.selectPiece(futureBoard, parseInt(this.pieceNums[i]));
          //has the king just castled and passed through check?
          if(this.futureBoard.moveChain[this.futureBoard.moveChain.length - 1].hasJustCastled) {
            if(this.futureBoard.turnToMove === "black") {
              if(this.futureBoard.moveChain[this.futureBoard.moveChain.length - 1].newPieceNumber === 7) {
                for(let i = Math.min(futureBoard.initialKingColumn, 7); i <= Math.max(futureBoard.initialKingColumn, 7); i++) {
                  if(futureBoard.highlightedCells.has(i)) {
                    this.kingCanBeCaptured = true;
                    break;
                  }
                }
              } else {
                for(let i = Math.min(futureBoard.initialKingColumn, 3); i <= Math.max(futureBoard.initialKingColumn, 3); i++) {
                  if(futureBoard.highlightedCells.has(i)) {
                    this.kingCanBeCaptured = true;
                    break;
                  }
                }
              }
            } else {
              if(this.futureBoard.moveChain[this.futureBoard.moveChain.length - 1].newPieceNumber === 63) {
                for(let i = Math.min(futureBoard.initialKingColumn, 7); i <= Math.max(futureBoard.initialKingColumn, 7); i++) {
                  if(futureBoard.highlightedCells.has(56 + i)) {
                    this.kingCanBeCaptured = true;
                    break;
                  }
                }
              } else {
                for(let i = Math.min(futureBoard.initialKingColumn, 3); i <= Math.max(futureBoard.initialKingColumn, 3); i++) {
                  if(futureBoard.highlightedCells.has(56 + i)) {
                    this.kingCanBeCaptured = true;
                    break;
                  }
                }
              }
            }
          }
          if(!this.kingCanBeCaptured) {
            futureBoard.highlightedCells.forEach(cell => {
              if(futureBoard.pieces[cell] && futureBoard.pieces[cell].name === "king" && futureBoard.pieces[cell].color !== futureBoard.turnToMove) {
                this.kingCanBeCaptured = true;
              }
            });
          }
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
    this.boardService.selectPiece(futureBoard, squareNumber);
  }
}
