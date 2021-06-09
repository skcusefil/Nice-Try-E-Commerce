namespace Core.OrderAggregate
{
    public class Address
    {
        //need empty constructor for creating migrations
        public Address()
        {
        }

        public Address(int id, string firstName, string lastName, string street, string city, string state, string zipCode)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Street = street;
            City = city;
            State = state;
            ZipCode = zipCode;
        }

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}