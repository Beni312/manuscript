import { CommonModule } from '@angular/common';
// import {
//   MatButtonModule,
//   MatCardModule,
//   MatCheckboxModule,
//   MatDialogModule,
//   MatFormFieldModule,
//   MatIconModule,
//   MatInputModule,
//   MatListModule,
//   MatMenuModule,
//   MatPaginatorModule,
//   MatProgressSpinnerModule,
//   MatRippleModule,
//   MatSelectModule,
//   MatSidenavModule,
//   MatSortModule,
//   MatTableModule,
//   MatTabsModule,
//   MatToolbarModule,
//   MatTooltipModule
// } from '@angular/material';
import { NgModule } from '@angular/core';
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from "@angular/material/list";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

const importExport = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
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
