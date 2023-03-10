import { Move } from "./Move";
import { Piece } from "./Piece";

export interface Board {
    liveBoard: boolean,
    pieces: {[key: number]: Piece},
    moveChain: Move[],
    turnToMove: string,
    initialKingColumn: number,
    whiteCanCastleLeft: boolean,
    whiteCanCastleRight: boolean,
    blackCanCastleLeft: boolean,
    blackCanCastleRight: boolean,
    selectedPiece: number,
    highlightPieceOnBoard: boolean,
    enPassant: number,
    highlightedCells: Set<number>
}