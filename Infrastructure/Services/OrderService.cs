using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.OrderAggregate;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService_Stripe _paymentService;
        private readonly IPaymentService_Paypal _paymentService_Paypal;
        private readonly IPaymentService_Stripe _paymentService_Stripe;
        public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepo, IPaymentService_Stripe paymentService_Stripe,
        IPaymentService_Paypal paymentService_Paypal)
        {
            _paymentService_Stripe = paymentService_Stripe;
            _paymentService_Paypal = paymentService_Paypal;
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAdress, string paypalOrderId)
        {
            //get basket from the repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            //get items from products repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            //get delivery method from repo 
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            //calc subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            //check if order exists 
            var spec = new OrderByPaymentIntentIdSpecification(basketId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);

                //create payment with stripe
                //await _paymentService.CreateOrUpdatePaymentIntent_Stripe(basket.PaymentIntentId);

                //create payment with paypal
                await _paymentService_Paypal.CreateOrUpdatePaymentIntent_Paypal(basketId, paypalOrderId);

            }


            //create order stripe
            //var order = new Order(buyerEmail, shippingAdress, deliveryMethod, items, subtotal, basket.PaymentIntentId);

            //create order for paypalpayment
            var order = new Order(buyerEmail, shippingAdress, deliveryMethod, items, subtotal, paypalOrderId);
            _unitOfWork.Repository<Order>().Add(order);

            //save to database
            var result = await _unitOfWork.Complete();

            if (result <= 0) return null;

            //delete basket if success save to database
            //await _basketRepo.DeleteBasketAsync(basketId);

            //return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethosAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrderWithItemsAndOrderingSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrderWithItemsAndOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}