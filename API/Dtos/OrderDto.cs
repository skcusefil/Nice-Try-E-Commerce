namespace API.Dtos
{
    public class OrderDto
    {
        public string BasketId { get; set; }
        public int deliveryMethodId { get; set; }
        public AddressDto ShipToAddress { get; set; }
    }
}