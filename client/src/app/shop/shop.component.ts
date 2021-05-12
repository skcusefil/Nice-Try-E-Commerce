import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  //@ViewChild('search', {static: true}) searchTerm: ElementRef;
  @ViewChild('search',{static: true}) searchTerm: ElementRef;

  shopName = 'SHOPPING WEB';
  products : IProduct[];
  brands : IBrand[];
  types : IType[];

  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to low', value: 'priceDesc'}
  ]

  shopParams = new ShopParams();
  totalCount: number;
  totalPages: number;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
   this.getProducts();
   this.getBrands();
   this.getTypes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.products = response.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
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
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(sort: string){
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch(){
    
    if(this.searchTerm.nativeElement.value){
      this.shopParams.search = this.searchTerm.nativeElement.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  onReset(){
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
