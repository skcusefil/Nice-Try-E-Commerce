using System.Threading.Tasks;
using Core.Entities;
using Core.OrderAggregate;

namespace Core.Interfaces
{
    public interface IPaymentService_Paypal
    {
         
        Task<CustomerBasket> CreateOrUpdatePaymentIntent_Paypal(string basketId, string paypalOrderId);
        Task<Order> UpdateOrderPaymentSucceeded_Paypal(string paymentIntentId);
        Task<Order> UpdateOrderPaymentFailed_Paypal(string paymentIntentId);
    }
}