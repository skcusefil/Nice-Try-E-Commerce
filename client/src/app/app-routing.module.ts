import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path:'', component: HomeComponent, data:{breadcrumb: 'Home'}},
  {path:'shop', loadChildren: ()=> import('./shop/shop.module').then(mod => mod.ShopModule), data:{breadcrumb: 'Shop'}},
  {path:'basket', loadChildren: ()=> import('./basket/basket.module').then(mod => mod.BasketModule), data:{breadcrumb: 'Basket'}},
  {path:'checkout',canActivate: [AuthGuard], 
  loadChildren: ()=> import('./checkout/checkout.module').then(mod => mod.CheckoutModule), data:{breadcrumb: 'Checkout'}},
  {path:'account', loadChildren: ()=> import('./account/account.module').then(mod => mod.AccountModule), data:{breadcrumb: {skip: true}}},
  {path:'orders',canActivate: [AuthGuard], 
  loadChildren: ()=> import('./order/order.module').then(mod => mod.OrderModule), data:{breadcrumb: 'Order'}},
  {path:'**', loadChildren: ()=> import('./admin/admin.module').then(mod => mod.AdminModule), data:{breadcrumb: 'Admin'}},
  {path: '**', redirectTo: '', pathMatch:'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
