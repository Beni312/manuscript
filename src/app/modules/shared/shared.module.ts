import { AutocompleteMultiSelectComponent } from './components/autocomplete-multi-select/autocomplete-multi-select.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

const declareExport = [
  AutocompleteMultiSelectComponent,
  ClickOutsideDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    declareExport
  ],
  exports: [
    declareExport
  ]
})
export class SharedModule {
}
