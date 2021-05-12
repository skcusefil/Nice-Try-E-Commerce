import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html',
  styleUrls: ['./page-nav.component.scss']
})
export class PageNavComponent implements OnInit {

  @Input() totalCount: number;
  @Input() pageSize: number;

  //EventEmitter need to get something from angular core
  @Output() pageChanged = new EventEmitter<number>();


  constructor() { }

  ngOnInit(): void {
  }

  onPagerChange(event: any) {
    this.pageChanged.emit(event.page);
  }
}
