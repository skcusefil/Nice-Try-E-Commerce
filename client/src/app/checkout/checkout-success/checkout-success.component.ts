import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { Order } from 'src/app/shared/models/order';
import { ImportDeclaration } from 'typescript';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {

  order: Order;

  constructor(private router: Router, private basketService: BasketService) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;
    if(state){
      this.order = state as Order
    }
  }

  ngOnInit(): void {
  }

  viewOrders(){
    this.router.navigateByUrl('order');
  }

  deleteBasket(){
    this.basketService.deleteBasket(this.basketService.getCurrentBasketValue());
  }

}
