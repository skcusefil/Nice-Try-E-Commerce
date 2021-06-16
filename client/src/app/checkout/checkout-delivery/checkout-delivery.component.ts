import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';


@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {

  @Input() checkoutForm: FormGroup;
  deliveryMethods: DeliveryMethod[];
  
  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.basketService.getCurrentBasketValue();
    console.log(this.basketService.getCurrentBasketValue());
    this.checkoutService.getDeliveryMethods().subscribe((dm:DeliveryMethod[])=>{
      if(dm){
        this.deliveryMethods = dm;
      }
    }, error => {
      console.log(error);
    })
  }

  setShippingPrice(deliveryMethod: DeliveryMethod){
    this.basketService.setShippingPrice(deliveryMethod);
  }

}
