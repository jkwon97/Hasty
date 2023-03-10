using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentApiController : BaseApiController
    {
        private IPaymentService _service;
        private ILogger _logger;

        public PaymentApiController(IPaymentService service, ILogger<PaymentApiController> logger) : base(logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost("checkout")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<string>> CreateCheckoutSession()
        {
            ObjectResult result = null;
            try
            {
                string sessionId = _service.CreateSession();
                ItemResponse<string> response = new ItemResponse<string> { Item = sessionId };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }
    }
}
