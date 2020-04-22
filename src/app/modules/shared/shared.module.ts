import { AutocompleteMultiSelectComponent } from './components/autocomplete-multi-select/autocomplete-multi-select.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRowExpandDirective } from './components/mat.row.expand.directive';
import { MaterialModule } from '../material/material.module';
import { NgModule } from '@angular/core';
import { UnderscoreToSpacePipe } from './services/underscore-to-space.pipe';

const declareExport = [
  AutocompleteMultiSelectComponent,
  ClickOutsideDirective,
  ConfirmDialogComponent,
  MatRowExpandDirective,
  UnderscoreToSpacePipe
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
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule {
}
