import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewChecked, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { Order } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

declare var Stripe;
declare var paypal;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input() checkoutForm: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardError: any;
  cardHandler = this.onChange.bind(this);
  loading = false;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;
  showSuccess: boolean;
  visible = true;



  constructor(private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router) { }

    @Output() pay:boolean = false;

  ngOnInit(): void {


   
  }

  ngAfterViewInit(): void {

    // get from API public key in stripe
    this.stripe = Stripe('pk_test_51J0wzjBrz4jN2GH6svbAMDEvMF1oAZqGYZTbNizYley0aoeQi9m7PWiX9h878jKMA9pDZScNVYAgcfcTgHhQBOFW00Ij8TNETj');
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);


    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);

  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  onChange(event) {
    console.log(event);
    if (event.error) {
      this.cardError = event.error.message;
    } else {
      this.cardError = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }

  submitorderTest() {
    const basket = this.basketService.getCurrentBasketValue();
    const OrderToCreate = this.getOrderToCreate(basket);
    this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOfCard').value
        }
      }
    }).then(result => {
      console.log(result);
      if (result.paymentIntent) {
        this.checkoutService.createOrder(OrderToCreate).subscribe((order: Order) => {
          this.basketService.deleteLocalBasket(basket.id);
          const navigationExtras: NavigationExtras = { state: order }
          this.router.navigate(['checkout/success'], navigationExtras);
        })
      } else {
        this.toastr.error(result.error.message);
        this.checkoutService.createOrder(OrderToCreate).toPromise();
      }
    })
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    }
  }

  async submitOrder() {
    this.loading = true;
    this.pay = true;
    const basket = this.basketService.getCurrentBasketValue();
    try {
      const createdOrder = await this.createOrderStripe(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toastr.error(paymentResult.error.message);
      }
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(basket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOfCard').value
        }
      }
    });
  }

  private async createOrderStripe(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }


}

