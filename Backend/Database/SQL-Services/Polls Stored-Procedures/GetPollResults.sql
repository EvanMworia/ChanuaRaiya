USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE GetPollResults
    @PollId VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Get total votes for the poll
    DECLARE @TotalVotes INT;
    SELECT @TotalVotes = COUNT(*) FROM UserPollVotes WHERE PollId = @PollId;

    -- Select poll results
    SELECT 
        po.OptionId, 
        po.OptionText, 
        ISNULL(COUNT(uv.OptionId), 0) AS VoteCount
    FROM PollOptions po
    LEFT JOIN UserPollVotes uv 
        ON po.OptionId = uv.OptionId 
        AND po.PollId = uv.PollId
    WHERE po.PollId = @PollId
    GROUP BY po.OptionId, po.OptionText;

    -- Return total votes separately
    SELECT @TotalVotes AS TotalVotes;
END;
