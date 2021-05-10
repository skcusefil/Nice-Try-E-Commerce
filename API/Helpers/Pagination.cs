using System.Collections.Generic;

namespace API.Helpers
{
    public class Pagination<T> where T : class
    {
        public Pagination(int pageIndex, int pageSize, int totalItems,int itemParamCount, IReadOnlyList<T> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalItems = totalItems;
            this.TotalPages = (int)System.Math.Ceiling(totalItems/(double)pageSize);
            Data = data;
            ItemParamCount = itemParamCount;
        }

        public int PageIndex { get; set; }
        public int ItemParamCount {get; set;}
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public IReadOnlyList<T> Data { get; set; }
        
    }
}