using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Services.Interfaces;
using Stripe;
using Stripe.Checkout;
using Stripe.Issuing;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace Sabio.Services
{
    public class PaymentService : IPaymentService
    {
        private AppKeys _appKeys;

        public PaymentService(IOptions<AppKeys> appKeys)
        {
            _appKeys = appKeys.Value;
            StripeConfiguration.ApiKey = _appKeys.StripeApiKey;
        }


        public string CreateSession()
        {
            var domain = _appKeys.BaseClientUrl;   
            var options = new SessionCreateOptions
            {
                SuccessUrl = $"{domain}/success",
                LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            Price = "price_1MW71cAXaShOpBQd1kBEer5R",
                            Quantity = 1,
                        },
                    },
                Mode = "payment",
            };
            var service = new SessionService();
            Session session = service.Create(options);
            string sessionId = session.Id;
            return sessionId;
        }
    }
}
