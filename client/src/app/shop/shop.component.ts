import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/ShopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  shopName = 'SHOPPING WEB';
  products : IProduct[];
  brands : IBrand[];
  types : IType[];

  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to low', value: 'priceDesc'}
  ]

  shoptParams = new ShopParams();
  totalCount: number;
  totalPages: number;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
   this.getProduct();
   this.getBrands();
   this.getTypes();
  }

  getProduct(){
    this.shopService.getProducts(this.shoptParams).subscribe(response => {
      this.products = response.data;
      this.shoptParams.pageNumber = response.pageIndex;
      this.shoptParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    })
  }

  getBrands(){
    this.shopService.getBrand().subscribe(response => {
      this.brands = [{id: 0, name: 'All'}, ...response];
    })
  }

  getTypes(){
    this.shopService.getType().subscribe(response => {
      this.types = [{id: 0, name: 'All'}, ...response];
    })
  }

  onBrandSelected(brandId: number){
    this.shoptParams.brandId = brandId;
    this.getProduct();
  }

  onTypeSelected(typeId: number){
    this.shoptParams.typeId = typeId;
    this.getProduct();
  }

  onSortSelected(sort: string){
    this.shoptParams.sort = sort;
    this.getProduct();
  }

  onPageChanged(event: any){
    this.shoptParams.pageNumber = event.page;
    this.getProduct();
  }
}
