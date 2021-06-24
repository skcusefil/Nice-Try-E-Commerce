using System.Threading.Tasks;
using Core.Entities;
using Core.OrderAggregate;

namespace Core.Interfaces
{
    public interface IPaymentService_Stripe
    {
        Task<CustomerBasket> CreateOrUpdatePaymentIntent_Stripe(string basketId);
        Task<Order> UpdateOrderPaymentSucceeded_Stripe(string paymentIntentId);
        Task<Order> UpdateOrderPaymentFailed_Stripe(string paymentIntentId);

    }
}