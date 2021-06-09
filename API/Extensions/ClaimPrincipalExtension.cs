using System.Linq;
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimPrincipalExtension
    {
        public static string RetrieveEmailFromPrincipla(this ClaimsPrincipal user)
        {
            return user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }
    }
}