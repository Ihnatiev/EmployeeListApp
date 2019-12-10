import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpListComponent } from './emps/emp-list/emp-list.component';
import { EmpCreateComponent } from './emps/emp-create/emp-create.component';
import { EmpViewComponent } from './emps/emp-view/emp-view.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: EmpListComponent },
  { path: 'create', component: EmpCreateComponent, canActivate: [AuthGuard] },
  { path: 'details/:employeeId', component: EmpViewComponent },
  { path: 'edit/:employeeId', component: EmpCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}

