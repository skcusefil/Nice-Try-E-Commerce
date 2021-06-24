import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketRoutingModule } from './basket-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { CheckoutPaypalComponent } from '../checkout/checkout-paypal/checkout-paypal.component';
import { NgxPaypalComponent } from 'ngx-paypal';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BasketRoutingModule,
    SharedModule    
  ]
})
export class BasketModule { }
