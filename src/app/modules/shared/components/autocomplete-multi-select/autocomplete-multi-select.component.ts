import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormField } from '@angular/material';

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
export class AutocompleteMultiSelectComponent implements ControlValueAccessor, OnChanges, AfterViewInit {

  query = '';
  filteredList = [];
  showDropdown = false;

  selected: any[] = [];
  @Input()
  items: any[];
  @Input()
  property;
  @Input()
  placeholder: string;
  @Input()
  inputWidth: string = '200px';
  @Input()
  selectedItemsHeight = '120px';
  @Input()
  toOrder: boolean = true;

  @ViewChild('field')
  field: MatFormField;
  @ViewChild('dropdown')
  dropdown: ElementRef;

  propagateChange: any = () => {};
  propagateTouch: any = () => {};

  constructor(private renderer: Renderer2) {
  }

  clearSearch() {
    this.query = '';
    this.filter();
  }

  filter() {
    this.filteredList = this.items.filter(el => {
      if (el !== undefined) {
        return (el[this.property].toLowerCase().indexOf(this.query.toLowerCase())) > -1 && !this.isSelected(el);
      }
    });
  }

  isSelected(element) {
    let isSelected = false;
    this.selected.forEach(item => {
      if (item[this.property] == element[this.property] && !isSelected) {
        isSelected = true;
      }
    });
    return isSelected;
  }

  select(item) {
    this.selected.push(item);
    this.query = '';
    this.filteredList.splice(this.filteredList.indexOf(item), 1);
  }

  remove(item) {
    this.selected.splice(this.selected.indexOf(item), 1);
    this.filter();
  }

  setShowDropdown(clickOutside: boolean) {
    this.propagateTouch();
    this.showDropdown = !clickOutside;
  }

  writeValue(obj): void {
    if (obj) {
      this.selected = obj;
      this.filter();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  ngOnChanges(): void {
    if (this.items && this.toOrder) {
      this.items = this.items.sort((a, b) => {
        if (a[this.property] < b[this.property]) {
          return -1;
        } else if (a[this.property] > b[this.property]) {
          return 1;
        }
        return 0;
      });
    }
    this.propagateChange(this.selected);
  }

  ngAfterViewInit(): void {
    const width = this.field._elementRef.nativeElement.clientWidth + 3;
    this.renderer.setStyle(
      this.dropdown.nativeElement,
      'width',
      width + 'px'
    );
  }
}
