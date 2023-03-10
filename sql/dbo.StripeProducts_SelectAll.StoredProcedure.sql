USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[StripeProducts_SelectAll]    Script Date: 2/22/2023 4:58:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Jennifer Kwon>
-- Create date: <02-06-23>
-- Description:	<StripeProducts SelectAll>
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[StripeProducts_SelectAll]

/* ----TEST CODE----

EXECUTE dbo.StripeProducts_SelectAll

*/

AS

BEGIN
	SELECT Id,
		   ProductId,
		   PriceId,
		   Amount,
		   Name
	FROM dbo.StripeProducts
END
GO
