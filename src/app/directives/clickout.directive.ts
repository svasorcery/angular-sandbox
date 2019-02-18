import { Directive, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickout]'
})
export class ClickoutDirective {
  constructor(private _elementRef: ElementRef) {}

  @Output() public clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: ElementRef) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(null);
    }
  }
}
