import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent {
  @Input() name: string = "";
  @Input() color: string = "";





}
