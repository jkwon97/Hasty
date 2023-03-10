using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using System;
using System.Collections.Generic;
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/subscriptions")]
    [ApiController]
    public class SubscriptionApiController : BaseApiController
    {
        private IStripeSubscriptionService _service;
        private ILogger _logger;
        private IAuthenticationService<int> _authService = null;

        public SubscriptionApiController(IStripeSubscriptionService service, ILogger<SubscriptionApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _logger = logger;
            _authService = authService;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemsResponse<List<StripeProduct>>> GetAllProducts()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<StripeProduct> list = _service.GetAllStripeProducts();
                if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<StripeProduct> { Items = list};
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost("checkout")]
        public ActionResult<ItemResponse<string>> CreateSubscriptionSession(StripeProduct product)
        {
            ObjectResult result = null;
            try
            {
                string sessionId = _service.CreateSession(product.PriceId);
                ItemResponse<string> response = new ItemResponse<string> { Item = sessionId };
                result = Created201(response);
            }
            catch(Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPost("session")]
        public ActionResult<ItemResponse<string>> AddSubscriptionOnSuccess(string sessionId)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                string invoiceId = _service.AddSubscriptionOnSuccess(sessionId, userId);
                ItemResponse<string> response = new ItemResponse<string> { Item = invoiceId };
                result = Created201(response);
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("status")]
        public ActionResult<ItemResponse<StripeSubscription>> GetCurrentSubscription()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                StripeSubscription currentSub = _service.GetSubscriptionById(userId);
                if(currentSub == null)
                {
                    code = 404;
                    response = new ErrorResponse("Subscription not found");
                }
                else
                {
                    response = new ItemResponse<StripeSubscription> { Item = currentSub };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("invoice/{invoiceId}")]
        public ActionResult<ItemResponse<Invoice>> GetLatestInvoice(string invoiceId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Invoice latestInvoice = _service.GetInvoice(invoiceId);
                if (latestInvoice == null)
                {
                    code = 404;
                    response = new ErrorResponse("Invoice not found");
                }
                else
                {
                    response = new ItemResponse<Invoice> { Item = latestInvoice };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}
