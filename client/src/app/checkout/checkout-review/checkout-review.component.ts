import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper: CdkStepper;

  basket$: Observable<IBasket>;
  @Input() checkoutForm: FormGroup;
  constructor(private basketService:BasketService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  createPaymentIntent(){
    return this.basketService.createPaymentIntent().subscribe((response:any)=>{
      console.log(response);
      this.toastr.success('Payment intent created');
      this.appStepper.next();
    }, error=>{
      console.log(error);
      //this.toastr.error(error.message);
    })
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }

}
