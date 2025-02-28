USE CHANUARAIYA
GO


CREATE OR ALTER PROCEDURE AddNewDocument
    @DocumentId VARCHAR(255),
    @Title VARCHAR(255),
    @Description VARCHAR(500),
    @DocumentURL VARCHAR(500)
AS
BEGIN
    INSERT INTO Documents (DocumentId, Title, Description, DocumentURL)
    VALUES (@DocumentId, @Title, @Description, @DocumentURL)
END;

