using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Jeny",
                    Email ="jeny@mail.com",
                    UserName = "jeny",
                    Address = new Address
                    {
                        FirstName = "Jeny",
                        LastName = "Lee",
                        Street = "1 Street",
                        City = "Hannover",
                        State = "Nidersachsen",
                        ZipCode = "30457"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}