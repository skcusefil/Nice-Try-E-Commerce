import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  shopName = 'SHOPPING WEB';
  products: IProduct[];

  constructor(private http: HttpClient){

  }

  ngOnInit():void{
    this.http.get('https://localhost:5001/api/Products?pageSize=50').subscribe((response: any)=>{
      console.log(response);
      this.products = response.data;
    }, error => {
      console.log(error);
    })
  }
}
