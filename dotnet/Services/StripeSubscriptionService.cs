using Microsoft.Extensions.Options;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Services.Interfaces;
using Stripe;
using Stripe.Checkout;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace Sabio.Services
{
    public class StripeSubscriptionService : IStripeSubscriptionService
    {
        private AppKeys _appKeys;
        IDataProvider _data = null;

        public StripeSubscriptionService(IOptions<AppKeys> appKeys, IDataProvider data)
        {
            _appKeys = appKeys.Value;
            _data = data;
            StripeConfiguration.ApiKey = _appKeys.StripeApiKey;
        }

        public List<StripeProduct> GetAllStripeProducts()
        {
            var domain = _appKeys.BaseClientUrl;
            string procName = "[dbo].[StripeProducts_SelectAll]";
            List<StripeProduct> list = null;

            _data.ExecuteCmd(
                procName,
                null,
                (reader, set) =>
                {
                    int startingIndex = 0;
                    StripeProduct product = MapSingleProduct(reader, ref startingIndex);
                    if (list == null)
                    {
                        list = new List<StripeProduct>();
                    }
                    list.Add(product);
                });
            return list;
        }
        public string CreateSession(string priceId)
        {
            var domain = _appKeys.BaseClientUrl;
            var sessionOptions = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = priceId,
                        Quantity = 1,
                    },
                },
                Mode = "subscription",
                SuccessUrl = domain + "/success?session_id={CHECKOUT_SESSION_ID}",
            };
            var service = new SessionService();
            Session session = service.Create(sessionOptions);
            string sessionId = session.Id;
            return sessionId;
        }

        public string AddSubscriptionOnSuccess(string sessionId, int userId)
        {
            int subId = 0;
            var service = new SessionService();
            Session session = service.Get(sessionId);
            string stripeSubId = session.SubscriptionId;
            var subService = new SubscriptionService();
            Subscription subscription = subService.Get(stripeSubId);
            string procName = "[dbo].[Subscriptions_Insert]";

            _data.ExecuteNonQuery(
                procName,
                (collection) =>
                {
                    AddSubscriptionParams(subscription, collection, userId);
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    collection.Add(idOut);
                },
                (returnCollection) =>
                { 
                    object objectId = returnCollection["@Id"].Value;
                    int.TryParse(objectId.ToString(), out subId);
                });
            return subscription.LatestInvoiceId;
        }
                

        public StripeSubscription GetSubscriptionById(int userId)
        {
            StripeSubscription currentSub = null;

            string procName = "[dbo].[Subscriptions_Select_ByUserId]";
            _data.ExecuteCmd(
                procName,
                (collection) =>
                {
                    collection.AddWithValue("@UserId", userId);
                },
                (reader, set) =>
                {
                    int index = 0;
                    currentSub = MapCurrentSubscription(reader, ref index);
                });
            return currentSub;
        }

        public Invoice GetInvoice(string invoiceId)
        {
            var service = new InvoiceService();
            Invoice invoice = service.Get(invoiceId);
            return invoice;
        }

        private static StripeSubscription MapCurrentSubscription(IDataReader reader, ref int index)
        {
            StripeSubscription currentSub = new StripeSubscription();
            currentSub.SubId = reader.GetSafeInt32(index++);
            currentSub.PlanId = reader.GetSafeInt32(index++);
            currentSub.PlanName = reader.GetSafeString(index++);
            currentSub.PlanCost = reader.GetSafeInt32(index++);
            currentSub.DateCreated = reader.GetSafeDateTime(index++);
            currentSub.DateEnd = reader.GetSafeDateTime(index++);
            currentSub.Status = reader.GetSafeString(index++);

            return currentSub;
        }

        private static void AddSubscriptionParams(Subscription subscription, SqlParameterCollection collection, int userId)
        {
            collection.AddWithValue("@SubscriptionId", subscription.Id);
            collection.AddWithValue("@UserId", userId);
            collection.AddWithValue("@CustomerId", subscription.CustomerId);
            collection.AddWithValue("@DateCreated", subscription.CurrentPeriodStart);
            collection.AddWithValue("@DateEnd", subscription.CurrentPeriodEnd);
            collection.AddWithValue("@Status", subscription.Status);
            collection.AddWithValue("@ProductId", subscription.Items.Data[0].Price.ProductId);
        }

        private static StripeProduct MapSingleProduct(IDataReader reader, ref int startingIndex)
        {
            StripeProduct stripeProduct = new StripeProduct();
            stripeProduct.Id = reader.GetSafeInt32(startingIndex++);
            stripeProduct.ProductId = reader.GetSafeString(startingIndex++);
            stripeProduct.PriceId = reader.GetSafeString(startingIndex++);
            stripeProduct.Amount = reader.GetSafeInt32(startingIndex++);
            stripeProduct.Name = reader.GetSafeString(startingIndex++);
            return stripeProduct;
        }
    }
}
