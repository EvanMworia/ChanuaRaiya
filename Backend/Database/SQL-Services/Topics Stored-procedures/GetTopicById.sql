USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE GetTopicById(@TopicId VARCHAR(255))
AS
BEGIN
    SELECT * FROM Topics WHERE TopicId = @TopicId
END