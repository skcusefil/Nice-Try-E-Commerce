using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productRepo,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IMapper mapper)
        {
            _productRepo = productRepo;
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductDto>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            //here will specific type of product
            var spec = new ProductsWithTypesAndBrands(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);
            var totalItems = await _productRepo.CountAsync(spec);

            var products = await _productRepo.ListAsync(spec);

            //var productDtos = products.Select(product => _mapper.Map<Product, ProductDto>(product));
            //var productDtos = _mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductDto>>(products);
            var productPerPage = _mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductDto>>(products);

            var pagination = new Pagination<ProductDto>(productParams.PageIndex, productParams.PageSize, totalItems, productPerPage);

            return Ok(pagination);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrands(id);

            var product = await _productRepo.GetEntityWithSpec(spec);

            var productDto = _mapper.Map<Product, ProductDto>(product);


            return Ok(productDto);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandRepo.ListAllAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            return Ok(await _productTypeRepo.ListAllAsync());
        }
    }
}