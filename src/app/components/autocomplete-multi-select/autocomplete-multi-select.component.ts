import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-autocomplete-multi-select',
  templateUrl: './autocomplete-multi-select.component.html',
  styleUrls: ['./autocomplete-multi-select.component.scss']
})
export class AutocompleteMultiSelectComponent {

  public query = '';

  public filteredList = [];
  public selected: any = [];
  public elementRef;
  public showDropdown = false;
  @Input()
  public items: any[];
  @Input()
  public property;
  @Input()
  public placeholder: string;
  @Output()
  public update = new EventEmitter<any>();

  @ViewChild('inp')
  input: ElementRef;

  constructor(private myElement: ElementRef) {
    this.elementRef = myElement;
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
    this.update.emit(this.selected);
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

}
