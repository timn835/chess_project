import { Piece } from "./Piece";

export interface Board {
    pieces: {[key: number]: Piece},
    turnToMove: string,
    selectedPiece: number,
    enPassant: number,
    highlightedCells: Set<number>
}