import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatSelectModule,
  MatTableModule,
  MatListModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatListModule,
    Ng2SearchPipeModule
  ]
})
export class AngularMaterialModule {}

