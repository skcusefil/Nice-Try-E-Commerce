using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Interfaces
{
    public interface ISpecification<T>
    {
        //Expression<Func<take, return>> Criteria {get;}
         Expression<Func<T, bool>> Criteria {get;}
         List<Expression<Func<T,object>>> Includes {get;}
    }
}