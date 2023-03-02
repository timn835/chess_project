import { Injectable } from '@angular/core';
import { Piece } from 'src/types/Piece';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor() { }

  getPosition() {
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

  addPawnMoves(pieces: {[key: number]: Piece}, highlightedCells: Set<number>, enPassant: number, pieceNumber: number, dirMult: number) {
    //we add the potential move
    if(!pieces[dirMult * 8 + pieceNumber]) {
      highlightedCells.add(dirMult * 8 + pieceNumber)
      //we add the possibility of jumping 2 squares on the first move
      if(this.onFirstRank(pieceNumber, dirMult) && !pieces[dirMult * 16 + pieceNumber]) {
        highlightedCells.add(dirMult * 16 + pieceNumber)
      }
    }
    //we add the potential captures

    if(this.pawnCanCapture(pieces, enPassant, pieceNumber, dirMult, 7)) {
      highlightedCells.add(dirMult * 7 + pieceNumber);
    }

    if(this.pawnCanCapture(pieces, enPassant, pieceNumber, dirMult, 9)) {
      highlightedCells.add(dirMult * 9 + pieceNumber);
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
