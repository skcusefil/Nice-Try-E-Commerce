import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'selenium-webdriver';
import { Order } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  order:Order;

  constructor(private routes: ActivatedRoute, 
    private breadcrumbService: BreadcrumbService,
    private orderService: OrderService) { 
      this.breadcrumbService.set('@OrderDetailed', '');
    }

  ngOnInit(): void {
    this.orderService.getOrderDetail(+this.routes.snapshot.paramMap.get('id')).subscribe((response:Order)=>{
      this.order = response;
      console.log(response);
      this.breadcrumbService.set('@orderDetailed', `Order Nr. #${response.id}-${response.status}`);
    },error => {
      console.log(error);
    })
  }

  getOrderDetail()
  {
    this.orderService.getOrderDetail(+this.routes.snapshot.paramMap.get('id')).subscribe((response:Order)=>{
      this.order = response;
      this.breadcrumbService.set('@orderDetailed', `Order #${response.id}-${response.status}`);
    },error => {
      console.log(error);
    })
  }

}
