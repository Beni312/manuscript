import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { NgModule } from '@angular/core';

const importExport = [
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
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
export class MaterialModule { }
