using System.IO;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;
using Order = Core.OrderAggregate.Order;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService_Stripe _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        private readonly IPaymentService_Paypal _paypalPayment;

        //Webhook from stripe will be changed every 90 days
        private const string WhSecret = "whsec_N4mxMf6mPQ8BM6NNFAElF8MdzIN7u5In";
        public PaymentsController(IPaymentService_Stripe paymentService, IPaymentService_Paypal paypalPayment, ILogger<PaymentsController> logger)
        {
            _paypalPayment = paypalPayment;
            _logger = logger;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId, string paypalOrderId)
        {
            //var basket = await _paymentService.CreateOrUpdatePaymentIntent_Stripe(basketId);
            var basket = await _paypalPayment.CreateOrUpdatePaymentIntent_Paypal(basketId, paypalOrderId);
            if (basket == null) return BadRequest("Problem with basket");

            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WhSecret);

            PaymentIntent intent;
            Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Succeeded", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentSucceeded_Stripe(intent.Id);
                    _logger.LogInformation("Order updated to payment received: ", order.Id);
                    break;
                case "payment_intent.payment_failed":
                    intent = intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Failed", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentFailed_Stripe(intent.Id);
                    _logger.LogInformation("Order updated to payment failed: ", order.Id);
                    break;
            }

            return new EmptyResult();
        }
    }
}