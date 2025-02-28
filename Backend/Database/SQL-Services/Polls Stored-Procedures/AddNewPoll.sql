USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE AddNewPoll
    @PollId VARCHAR(255),
    @Question VARCHAR(255)
    

AS
BEGIN
    INSERT INTO Polls (PollId, Question)
    VALUES (@PollId, @Question)
END