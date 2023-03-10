import { Piece } from "./Piece";

export interface Move {
    movedPiece: Piece,
    queenedPiece: Piece,
    oldPieceNumber: number,
    newPieceNumber: number,
    capturedPiece: Piece,
    capturedPieceNumber: number,
    enPassantAfterMove: number,
    whiteCanCastleLeftAfterMove: boolean,
    whiteCanCastleRightAfterMove: boolean,
    blackCanCastleLeftAfterMove: boolean,
    blackCanCastleRightAfterMove: boolean,
}