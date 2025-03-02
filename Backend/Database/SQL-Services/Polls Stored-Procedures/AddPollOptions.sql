USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE AddNewPollOption
    @PollId VARCHAR(255),
    @OptionText VARCHAR(255)
    

AS
BEGIN
    INSERT INTO PollOptions (PollId, OptionText)
    VALUES (@PollId, @OptionText)
END