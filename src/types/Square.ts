import { Piece } from "./Piece";

export interface Square {
    row: number,
    col: number,
    colAsString: string,
    piece?: Piece,
}