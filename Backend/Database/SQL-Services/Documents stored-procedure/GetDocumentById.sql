USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE GetDocumentById(@DocumentId VARCHAR(255))
AS
BEGIN
    SELECT * FROM Documents WHERE DocumentId = @DocumentId
END