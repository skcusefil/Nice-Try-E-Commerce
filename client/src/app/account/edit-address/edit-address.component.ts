import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Address } from 'src/app/shared/models/address';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {
  @Input() form: FormGroup;

  constructor(private accountService: AccountService, 
    private toastr: ToastrService, 
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
  }

  createCheckoutForm() {
    this.form = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        street: [null, [Validators.required]],
        city: [null, [Validators.required]],
        state: [null, [Validators.required]],
        zipCode: [null, [Validators.required]]


      }),

      deliveryForm: this.fb.group({
        deliveryMethod: [null, [Validators.required]]
      }),

      paymentForm: this.fb.group({
        nameOfCard: [null, [Validators.required]]
      })
    })
  }

  saveUserAddress(){
    this.accountService.updateUserAddress(this.form.get('addressForm').value).subscribe((address:Address)=>{
      this.toastr.success('Address saved');
      this.form.get('addressForm').reset(address);
    }, error => {
      this.toastr.error(error.message);
    })
  }

  
  getAddressFormValues(){
    this.accountService.getUserAddress().subscribe(address => {
      if(address){
        this.form.get('addressForm').patchValue(address);
      }
    },error=>{
      console.log(error);
    })
  }
}
