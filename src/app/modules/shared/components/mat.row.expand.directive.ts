import {Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[matRowExpand]'
})
export class MatRowExpandDirective {
  private row: any;
  private tRef: TemplateRef<any>;
  private opened: boolean;
  private static current: MatRowExpandDirective;

  @HostBinding('class.expanded')
  get expanded(): boolean {
    return this.opened;
  }

  @Input()
  set matRowExpand(value: any) {
    if (value !== this.row) {
      this.row = value;
    }
  }

  @Input('matRowExpandTemplate')
  set template(value: TemplateRef<any>) {
    if (value !== this.tRef) {
      this.tRef = value;
    }
  }

  constructor(public vcRef: ViewContainerRef) {
  }

  @HostListener('click')
  onClick(): void {
    this.toggle();
  }

  toggle(): void {
    if (MatRowExpandDirective.current != null) {
      if (MatRowExpandDirective.current.vcRef == this.vcRef) {
        MatRowExpandDirective.current.vcRef.clear();
        MatRowExpandDirective.current = null;
        this.opened = false;
      } else {
        MatRowExpandDirective.current.vcRef.clear();
        MatRowExpandDirective.current.opened = false;
        MatRowExpandDirective.current = this;
        this.opened = true;
        this.render();
      }
    } else {
      MatRowExpandDirective.current = this;
      this.render();
      this.opened = true;
    }
  }

  private render(): void {
    this.vcRef.clear();
    if (this.tRef && this.row) {
      this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
    }
  }
}
