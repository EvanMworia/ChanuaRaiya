USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE GetViewById @ViewId VARCHAR(255)
AS
BEGIN
    SELECT * FROM Views WHERE ViewId=@ViewId
END