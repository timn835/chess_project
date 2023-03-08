import { Move } from "./Move";
import { Piece } from "./Piece";

export interface Board {
    liveBoard: boolean,
    pieces: {[key: number]: Piece},
    moveChain: Move[],
    turnToMove: string,
    selectedPiece: number,
    highlightPieceOnBoard: boolean,
    enPassant: number,
    highlightedCells: Set<number>
}