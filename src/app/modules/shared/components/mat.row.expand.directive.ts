import {Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export const SlideRowAnimation = trigger('detailExpand', [
  state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
  state('*', style({height: '*', visibility: 'visible'})),
  transition('void <=> *', animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

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

  @HostListener('click', ['$event'])
  onClick(event): void {
    let isExpandable = true;
    event.path.forEach(item => {
      if (item.classList && item.classList.contains('ignore')) {
        isExpandable = false;
      }
    });
    if (isExpandable) {
      this.toggle();
    }
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
