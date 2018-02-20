import { Component, ElementRef, forwardRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class AutocompleteMultiSelectComponent implements ControlValueAccessor, OnChanges {

  query = '';
  filteredList = [];
  showDropdown = false;

  @Input('selected')
  selected: any[] = [];
  @Input()
  items: any[];
  @Input()
  property;
  @Input()
  placeholder: string;

  @ViewChild('inp')
  input: ElementRef;

  propagateChange:any = () => {};

  constructor() {
  }

  clearSearch() {
    this.query = '';
    this.input.nativeElement.focus();
  }

  filter() {
    if (this.query !== '' && this.query.length > 0) {
      this.filteredList = this.items.filter(el => {
        this.showDropdown = true;
        if (el !== undefined) {
          return el[this.property].toLowerCase().indexOf(this.query.toLowerCase()) > -1 && this.selected.indexOf(el) === -1;
        }
      });
    } else {
      this.filteredList = [];
    }
  }

  select(item) {
    this.selected.push(item);
    this.query = '';
    this.filteredList = [];
    this.input.nativeElement.focus();
  }

  remove(item) {
    this.selected.splice(this.selected.indexOf(item), 1);
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  openDropDown() {
    this.showDropdown = true;
  }

  writeValue(obj: any): void {
    if (obj){
      this.select(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  ngOnChanges(): void {
    this.propagateChange(this.selected);
  }
}
