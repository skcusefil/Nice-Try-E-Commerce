import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { OrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {


  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDeliveryMethods(){
    return this.http.get(this.baseUrl+'orders/deliverymethods').pipe(
      map((dm:DeliveryMethod[])=>{
        //sort price from low to high
        return dm.sort((a,b)=> b.price - a.price);
      })
    )
  }

  createOrder(order: OrderToCreate){
    return this.http.post(this.baseUrl+'orders', order);
  }
}
