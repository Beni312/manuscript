import { AutocompleteMultiSelectComponent } from './components/autocomplete-multi-select/autocomplete-multi-select.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { NgModule } from '@angular/core';

const declareExport = [
  AutocompleteMultiSelectComponent,
  ClickOutsideDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
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
