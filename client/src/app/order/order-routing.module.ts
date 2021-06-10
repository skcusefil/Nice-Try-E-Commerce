import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { OrderService } from './order.service';
import { OrderComponent } from './order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {path:'', component: OrderComponent},
  {path: ':id', component: OrderDetailsComponent, data: {breadcrumb: {alias: 'orderDetailed'}}}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class OrderRoutingModule { }
