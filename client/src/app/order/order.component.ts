import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../shared/models/order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(private oderService:OrderService, private router:Router) { }

  orders: Order[];

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder(){
    this.oderService.getOrderForUser().subscribe((response:Order[]) => {
      this.orders = response;
      console.log(response);
    }, error => {
      console.log(error);
    })
  }

  viewOrderDetail(id:number){
    console.log("order nr."+id);
    this.router.navigateByUrl('order'+id);
  }

}
