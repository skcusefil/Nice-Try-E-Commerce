using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IProductRepository
    {
        Task<Product> GetProductByIdAsync(int id);
        Task<IReadOnlyList<Product>> GetProductsAsync();
        Task<ProductBrand> GetProducBrandtByIdAsync(int id);
        Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync();
        Task<ProductType> GetProducTypetByIdAsync(int id);
        Task<IReadOnlyList<ProductType>> GetProductTypesAsync();
    }
}