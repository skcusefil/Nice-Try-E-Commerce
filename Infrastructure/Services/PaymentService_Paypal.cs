using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.OrderAggregate;
using Infrastructure.Configurations;
using Microsoft.Extensions.Configuration;
using PayPal.Api;
using PayPalCheckoutSdk.Orders;
using Item = PayPal.Api.Item;
using Payer = PayPal.Api.Payer;

namespace Infrastructure.Services
{
    public class PaymentService_Paypal : IPaymentService_Paypal
    {
        private readonly IConfiguration _configuration;
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PaymentService_Paypal(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
            _configuration = configuration;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent_Paypal(string basketId, string paypalOrderId)
        {

            var basket = await _basketRepository.GetBasketAsync(basketId);

            if (basket == null) return null;

            var shippingPrice = 0m; //0m money

            if (basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync((int)basket.DeliveryMethodId);
                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {

                basket.PaymentIntentId = paypalOrderId;
                basket.ClientSecret = "EMKnf2pH8rqDJkyC8ww2us1qPf0DLPACN30c4kyQDqOZNCGTlsg_KwbD3eO_vCzMB0G7Q4gYeID3YZvj";
            }

            await _basketRepository.UpdateBasketAsync(basket);

            return basket;
        }

        public Task<Core.OrderAggregate.Order> UpdateOrderPaymentFailed_Paypal(string paymentIntentId)
        {
            throw new System.NotImplementedException();
        }

        public Task<Core.OrderAggregate.Order> UpdateOrderPaymentSucceeded_Paypal(string paymentIntentId)
        {
            throw new System.NotImplementedException();
        }
    }
}
