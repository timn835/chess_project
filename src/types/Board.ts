import { Move } from "./Move";
import { Piece } from "./Piece";

export interface Board {
    pieces: {[key: number]: Piece},
    moveChain: Move[],
    turnToMove: string,
    selectedPiece: number,
    enPassant: number,
    highlightedCells: Set<number>
}