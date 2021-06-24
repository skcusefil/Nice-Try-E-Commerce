import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from "ngx-paypal";
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketTotals } from 'src/app/shared/models/basket';
import { Order } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';
import { FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-paypal',
  templateUrl: './checkout-paypal.component.html',
  styleUrls: ['./checkout-paypal.component.scss']
})
export class CheckoutPaypalComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  @Input() checkoutForm: FormGroup;

  basketTotal: any;

  public payPalConfig?: IPayPalConfig;

  product = {
    price: 80,
    description: 'some discription'
  }

  constructor(private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.initConfig();


    this.basketService.basketTotal$.subscribe((res) => {
      if (res) {
        this.basketTotal = res.total;
      }
    });

  }

  private initConfig(): void {

    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AQoeJmx6vIkbR9LNxfke4wRfbnMdxlvlc8bnvcPOTSxk3gQaDs-XBO0eMK7j3FVLARW5zIUkVypFyck3',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: this.basketTotal,
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.basketTotal
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: this.basketTotal,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);


        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);

        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

        const basket = this.basketService.getCurrentBasketValue();
        console.log('basket',basket);
        const order = this.getOrderToCreate(basket, data.id);
        console.log('order',order);
        //console.log('data.id: '+data.id);
        // this.basketService.createPaymentIntent(data.id).subscribe((response: any) => {
        // });
        this.checkoutService.createOrder(order).subscribe((res) => {
          if (res) {
            this.basketService.deleteBasket(this.basketService.getCurrentBasketValue());
            const navigationExtras: NavigationExtras = { state: res };
            this.router.navigate(['checkout/success'], navigationExtras);
            console.log(res);
          }
        })


      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);

      }
    };
  }
  private getOrderToCreate(basket: IBasket, paypalId: string) {
    return {
      basketId: basket.id,
      deliveryMethodId: this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value,
      paypalOrderId: paypalId
    }
  }

}
