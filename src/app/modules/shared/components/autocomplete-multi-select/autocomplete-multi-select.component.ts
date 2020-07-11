import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'app-autocomplete-multi-select',
  templateUrl: './autocomplete-multi-select.component.html',
  styleUrls: ['./autocomplete-multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteMultiSelectComponent),
      multi: true
    }
  ]
})
export class AutocompleteMultiSelectComponent implements ControlValueAccessor, OnInit, AfterContentInit, AfterViewInit, OnChanges {

  query = '';
  filteredList = [];
  showDropdown = false;

  selected: any[] = [];
  @Input()
  items: any[];
  @Input()
  property: string | Function;
  @Input()
  placeholder: string;
  @Input()
  inputWidth = '200px';
  @Input()
  selectedItemsHeight = '120px';
  @Input()
  toOrder = true;

  @ViewChild('field', {static: false})
  field: MatFormField;
  @ViewChild('dropdown', {static: false})
  dropdown: ElementRef;

  propagateChange: any = () => {};
  propagateTouch: any = () => {};

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.propagateChange(this.selected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.toOrder && this.items) {
      this.items = this.sortByDisplayedProperty(this.items);
    }

    if (this.items) {
      this.filter();
    }
  }

  ngAfterContentInit(): void {
    if (this.toOrder) {
      this.selected = this.sortByDisplayedProperty(this.selected);
    }

    if (this.items) {
      this.filteredList = this.items.filter(el => !this.isSelected(el));
    }
  }

  ngAfterViewInit(): void {
    const width = this.field._elementRef.nativeElement.clientWidth;
    this.renderer.setStyle(
      this.dropdown.nativeElement,
      'width',
      width + 'px'
    );
  }

  clearSearch() {
    this.query = '';
    this.filter();
  }

  filter() {
    this.filteredList = this.items.filter(el => {
        return (this.getDisplayProperty(el).toLowerCase().indexOf(this.query.toLowerCase())) > -1 && !this.isSelected(el);
    });
  }

  isSelected(element) {
    let isSelected = false;
    this.selected.forEach(item => {
      if (this.getDisplayProperty(item).toLowerCase() === this.getDisplayProperty(element).toLowerCase() && !isSelected) {
        isSelected = true;
      }
    });
    return isSelected;
  }

  select(item) {
    this.selected.push(item);
    if (this.toOrder) {
      this.sortByDisplayedProperty(this.selected);
    }
    this.filter();
    this.propagateChange(this.selected);
  }

  remove(item) {
    this.selected.splice(this.selected.indexOf(item), 1);
    this.filter();
    this.propagateChange(this.selected);
  }

  setShowDropdown(clickOutside: boolean) {
    this.propagateTouch();
    this.showDropdown = !clickOutside;
  }

  writeValue(obj): void {
    if (obj) {
      this.selected = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  getDisplayProperty(item): string {
    if (typeof this.property === 'function') {
      return this.property(item);
    }
    return item[this.property];
  }

  sortByDisplayedProperty(array: any[]) {
    return array.sort((a, b) => {
      if (this.getDisplayProperty(a) < this.getDisplayProperty(b)) {
        return -1;
      } else if (this.getDisplayProperty(a) > this.getDisplayProperty(b)) {
        return 1;
      }
      return 0;
    });
  }
}
