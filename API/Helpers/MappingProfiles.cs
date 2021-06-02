using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductDto>()
            .ForMember(b => b.ProductBrand, option => option.MapFrom(source => source.ProductBrand.Name))
            .ForMember(t => t.ProductType, option => option.MapFrom(source => source.ProductType.Name))
            .ForMember(p => p.PictureUrl, option => option.MapFrom<ProductUrlResolver>());

            CreateMap<Address, AddressDto>();
            CreateMap<AddressDto, Address>();

            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();

        
        }
    }
}