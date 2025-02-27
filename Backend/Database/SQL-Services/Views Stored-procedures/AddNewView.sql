USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE AddNewView
    @ViewId VARCHAR(255),
    @Opinion VARCHAR(1600),
    @UserId VARCHAR(255),
    @TopicId VARCHAR(255)

AS
BEGIN
    INSERT INTO Views (ViewId, Opinion, UserId, TopicId)
    VALUES (@ViewId, @Opinion, @UserId, @TopicId)
END