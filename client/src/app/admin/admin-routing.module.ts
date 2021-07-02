import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageProductComponent } from './manage-product/manage-product.component';

const routes: Routes = [
  {path: '', component: AdminComponent},
  {path: 'create', component: ManageProductComponent, data: {breadcrumb: 'Create'}},
  {path: 'edit', component: ManageProductComponent, data: {breadcrumb: 'Edit'}}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
