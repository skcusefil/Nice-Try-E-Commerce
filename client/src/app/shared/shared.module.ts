import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PageNavComponent } from './components/page-nav/page-nav.component';



@NgModule({
  declarations: [
    PagingHeaderComponent,
    PageNavComponent,
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PageNavComponent,
    CarouselModule
  ]
})
export class SharedModule { }