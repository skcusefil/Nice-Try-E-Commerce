using System.Linq;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> specification)
        {
            var query = inputQuery;

            if(specification.Criteria != null)
            {
                // for using this
                // Here specification.Criteria can be lamda expression for example p => p.ProductTypeId == id
                query = query.Where(specification.Criteria); 
            }

            if(specification.OrderBy != null)
            {
                query = query.OrderBy(specification.OrderBy);
            }

            if(specification.OrderByDecending != null)
            {
                query = query.OrderByDescending(specification.OrderByDecending);
            }

            if(specification.IsPagingEnabled)
            {
                query = query.Skip(specification.Skip).Take(specification.Take);
            }

            query = specification.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}