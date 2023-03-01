import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { SetPieceDirective } from './custom directives/setpiece.directive';
import { HighlightDirective } from './custom directives/highlight.directive';
import { PieceComponent } from './piece/piece.component';
import { MoveComponent } from './move/move.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SetPieceDirective,
    HighlightDirective,
    PieceComponent,
    MoveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
