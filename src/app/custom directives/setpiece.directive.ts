import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: '[setPiece]'
})
export class SetPieceDirective {
    constructor(private element: ElementRef) {
        this.element = element;
    }

    ngOnInit() {
        this.element.nativeElement.style.backgroundColor = 'blue';
    }
}