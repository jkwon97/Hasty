USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Subscriptions_Select_ByUserId]    Script Date: 2/22/2023 4:58:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Jennifer Kwon>
-- Create date: <02-21-23>
-- Description:	<Subscriptions Select ByUserId>
-- Code Reviewer:

-- MODIFIED BY: <Jennifer Kwon>
-- MODIFIED DATE: <02-22-23>
-- Code Reviewer: <Kacy Lam>
-- Note:
-- =============================================

CREATE PROC [dbo].[Subscriptions_Select_ByUserId]
			@UserId int

/* ----TEST CODE----
DECLARE @UserId int = 3

EXECUTE dbo.Subscriptions_Select_ByUserId @UserId

*/

AS


BEGIN
	SELECT	s.Id [SubId]
			,sps.ProductId [PlanId]
			,sp.Name [PlanName]
			,sp.Amount [PlanCost]
			,s.DateCreated
			,s.DateEnd
			,s.Status
						
	FROM dbo.Subscriptions s
	INNER JOIN dbo.StripeProductSubscription sps ON s.Id = sps.SubscriptionId
	INNER JOIN dbo.StripeProducts sp ON sp.Id = sps.ProductId
	WHERE s.UserId = @UserId
END
GO
