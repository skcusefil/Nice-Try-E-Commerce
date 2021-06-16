import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { servicesVersion } from 'typescript';
import { Basket, IBasketItem, IBasketTotals } from '../../models/basket';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  
  @Input() shippingPrice: number
  @Input() subtotal: number;
  @Input() total: number;

  @Input() testInput:  Observable<IBasketTotals>


  item: IBasketTotals;
  basketTotal$: Observable<IBasketTotals>;

  constructor() { 
  }


  ngOnInit(): void {
  }


}
