using System.Collections.Generic;
using System.Threading.Tasks;
using Core.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService
    {
         Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, Address shippingAdress, string paypalOrderId);
         Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
         Task<Order> GetOrderByIdAsync(int id, string buyerEmail);
         Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethosAsync();
    }
}