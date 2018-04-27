import { Component, forwardRef, Input, OnChanges } from '@angular/core';
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

  selected: any[] = [];
  @Input()
  items: any[];
  @Input()
  property;
  @Input()
  placeholder: string;
  @Input()
  inputWidth: string = '200px';

  propagateChange: any = () => {};

  constructor() {
  }

  clearSearch() {
    this.query = '';
    this.filter();
  }

  filter() {
    this.filteredList = this.items.filter(el => {
      if (el !== undefined) {
        return el[this.property].toLowerCase().indexOf(this.query.toLowerCase()) > -1 && (this.selected.indexOf(el) === -1 || !this.isSelected(el));
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
    this.filter();
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

  writeValue(obj): void {
    if (obj) {
      this.selected = obj;
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
