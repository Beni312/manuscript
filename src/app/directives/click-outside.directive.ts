import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dropdown-click]'
})
export class ClickOutsideDirective {

  @Output()
  public clickOutside = new EventEmitter();
  @Output()
  public clickInside = new EventEmitter();

  constructor(private _elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
      this.clickOutside.emit(true);
    } else {
      this.clickInside.emit(false);
    }
  }

}
