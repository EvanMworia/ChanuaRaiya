USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE AddNewTopic
    @TopicId VARCHAR(255),
    @Title VARCHAR(255),
    @Context VARCHAR(255) = NULL

AS
BEGIN
    INSERT INTO Topics (TopicId, Title, Context)
    VALUES (@TopicId, @Title, @Context)
END