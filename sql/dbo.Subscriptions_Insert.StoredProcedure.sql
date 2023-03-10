USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Subscriptions_Insert]    Script Date: 2/22/2023 4:58:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Jennifer Kwon>
-- Create date: <02-10-23>
-- Description:	<StripeProducts Insert>
-- Code Reviewer:

-- MODIFIED BY: Jennifer Kwon
-- MODIFIED DATE: <02-21-23>
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC	[dbo].[Subscriptions_Insert]
			@SubscriptionId varchar(50)
			,@UserId int
			,@CustomerId varchar(50)
			,@DateCreated datetime2
			,@DateEnd datetime2
			,@Status varchar(50)
			,@ProductId varchar(50)
			,@Id int OUTPUT


/* ----TEST CODE----
	DECLARE	@SubscriptionId varchar(50) = 'testingtesting'
			,@UserId int = 3
			,@CustomerId varchar(50) = 'TestCustomerId'
			,@DateCreated datetime2 = getutcdate()
			,@DateEnd datetime2 = getutcdate()
			,@Status varchar(50) = 'active'
			,@ProductId int = 3
			,@Id int

	EXECUTE dbo.Subscriptions_Insert
			@SubscriptionId
			,@UserId
			,@CustomerId
			,@DateCreated
			,@DateEnd
			,@Status
			,@ProductId
			,@Id

	SELECT * FROM dbo.Subscriptions
	SELECT * FROM dbo.StripeProductSubscription
*/

AS

BEGIN
	INSERT INTO [dbo].[Subscriptions]
				([SubscriptionId]
				,[UserId]
				,[CustomerId]
				,[DateCreated]
				,[DateEnd]
				,[Status])
		VALUES	(@SubscriptionId
				,@UserId
				,@CustomerId
				,@DateCreated
				,@DateEnd
				,@Status)

	SET @Id = SCOPE_IDENTITY()

	INSERT INTO	[dbo].[StripeProductSubscription]
				([ProductId]
				,[SubscriptionId])
			SELECT
				sp.Id
				,@Id
			FROM dbo.StripeProducts as sp
			WHERE sp.ProductId = @ProductId
END
GO
