using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager, RoleManager<UserRole> roleManager)
        {
            var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Jeny",
                        Email = "jeny@test.com",
                        UserName = "jeny",
                        Address = new Address
                        {
                            FirstName = "Jeny",
                            LastName = "Kim",
                            Street = "Schaulfelder str. 17A",
                            City = "Hannover",
                            State = "Germany",
                            ZipCode = "90210"
                        }
                    },
                    new AppUser
                    {
                        DisplayName = "Admin",
                        Email = "admin@test.com",
                        UserName = "admin@test.com"
                    }
                };

            var roles = new List<UserRole>
                {
                    new UserRole {Name = "Admin"},
                    new UserRole {Name = "Customer"}
                };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Customer");
                if (user.Email == "admin@test.com") await userManager.AddToRoleAsync(user, "Admin");
            }
        }
    }
}