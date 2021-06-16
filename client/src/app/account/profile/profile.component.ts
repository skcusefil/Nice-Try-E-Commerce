import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from 'src/app/shared/models/address';
import { User } from 'src/app/shared/models/user';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser$: Observable<User>;
  userAddress: Address;


  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.getUserAddress();
  }

  getUserAddress(){
    this.accountService.getUserAddress().subscribe((address: Address) => {
      if(address){
        this.userAddress = address;
        console.log(address)
      }
    })
  } 

}
