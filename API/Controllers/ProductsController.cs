using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public ProductsController(IUnitOfWork unitOfWork,
        IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductDto>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            //here will specific type of product
            var spec = new ProductsWithTypesAndBrands(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            var totalItems = await _unitOfWork.Repository<Product>().CountAsync(countSpec);

            var products = await _unitOfWork.Repository<Product>().ListAsync(spec);

            var data = _mapper
                .Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(products);

            var pagination = new Pagination<ProductDto>(productParams.PageIndex, productParams.PageSize, totalItems, data);

            return Ok(pagination);
        }

        [Cached(600)]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrands(id);

            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

            var productDto = _mapper.Map<Product, ProductDto>(product);


            return Ok(productDto);
        }

        [Cached(600)]
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _unitOfWork.Repository<ProductBrand>().ListAllAsync());
        }

        [Cached(600)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            return Ok(await _unitOfWork.Repository<ProductType>().ListAllAsync());
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductCreateDto productToCreate)
        {
            var product = _mapper.Map<ProductCreateDto, Product>(productToCreate);
            product.PictureUrl = "images/products/placeholder.png";

            _unitOfWork.Repository<Product>().Add(product);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest("Problem creating product");


            var spec = new ProductsWithTypesAndBrands(product.Id);

            var productToReturn = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

            var productDto = _mapper.Map<Product, ProductDto>(productToReturn);

            return Ok(productDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(int id, ProductCreateDto productToUpdate)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            _mapper.Map(productToUpdate, product);

            _unitOfWork.Repository<Product>().Update(product);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest("Problem updating product");

            var spec = new ProductsWithTypesAndBrands(product.Id);

            var productToReturn = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

            var productDto = _mapper.Map<Product, ProductDto>(productToReturn);

            return Ok(productDto);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            if (product != null)
            {
                _unitOfWork.Repository<Product>().Delete(product);
            }
            else
            {
                return NotFound("Product not found");
            }

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest("Problem deleting product");

            return Ok();
        }
    }
}