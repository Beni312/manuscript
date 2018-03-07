import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { NgModule } from '@angular/core';

const importExport = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTabsModule,
  MatCardModule
];

@NgModule({
  imports: [
    CommonModule,
    importExport
  ],
  declarations: [],
  exports: [
    importExport
  ]
})
export class MaterialModule {
}
