import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EmpCreateComponent } from './emp-create/emp-create.component';
import { EmpListComponent } from './emp-list/emp-list.component';
import { EmpViewComponent } from './emp-view/emp-view.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    EmpCreateComponent,
    EmpListComponent,
    EmpViewComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class EmpsModule {}
