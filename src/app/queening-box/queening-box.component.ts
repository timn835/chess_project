import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Piece } from 'src/types/Piece';

@Component({
  selector: 'app-queening-box',
  templateUrl: './queening-box.component.html',
  styleUrls: ['./queening-box.component.css']
})
export class QueeningBoxComponent {
  rows: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
  cols: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  @Input() queenRows!: Set<number>;
  @Input() queenColumn: number = 0;
  @Output() promotionSelection: EventEmitter<Piece> = new EventEmitter<Piece>;
  selectedPiece!: Piece;

  onPromotionPieceSelected(row: number) {
    this.selectedPiece = this.pieces[row]
    this.promotionSelection.emit(this.selectedPiece);
  }

  //in the object below, the keys are row numbers
  pieces: {[key: number]: Piece} = {
    1:{
      color: "black",
      name: "queen"
    },
    2:{
      color: "black",
      name: "knight"
    },
    3:{
      color: "black",
      name: "rook"
    },
    4:{
      color: "black",
      name: "bishop"
    },
    8:{
      color: "white",
      name: "queen"
    },
    7:{
      color: "white",
      name: "knight"
    },
    6:{
      color: "white",
      name: "rook"
    },
    5:{
      color: "white",
      name: "bishop"
    }
  };
}
