import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.css']
})
export class MoveComponent {
  @Input() coordinates: number[] = [-1, -1]

  @Output()
  moveClicked: EventEmitter<number[]> = new EventEmitter<number[]>;

  onMoveClicked() {
    this.moveClicked.emit(this.coordinates);
  }
}
