USE CHANUARAIYA
GO
-- CREATE OR ALTER PROCEDURE CastVote
--     @VoteId VARCHAR(255), ---- GIVEN BY US
--     @UserId VARCHAR(255), --from users table
--     @PollId VARCHAR(255), -- the poll id
--     @OptionId VARCHAR(255) -- the choice they selected
    

-- AS
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM UserPollVotes WHERE UserId = @UserId AND PollId = @PollId)
--     BEGIN
--         INSERT INTO UserPollVotes (VoteId, UserId, PollId, OptionId)
--         VALUES (@VoteId, @UserId, @PollId, @OptionId);
--     END
--     ELSE
--     BEGIN
--         PRINT 'User has already voted in this poll.';
--     END
-- END

CREATE or alter PROCEDURE CastVote
    @VoteId VARCHAR(255),
    @UserId VARCHAR(255),
    @PollId VARCHAR(255),
    @OptionId INT
AS
BEGIN
    -- Check if the user has already voted in this poll
    IF EXISTS (SELECT 1 FROM UserPollVotes WHERE UserId = @UserId AND PollId = @PollId)
    BEGIN
        -- Return an error message
        THROW 50001, 'User has already voted in this poll.', 1;
        RETURN;
    END;

    -- Insert the new vote
    INSERT INTO UserPollVotes (VoteId, UserId, PollId, OptionId)
    VALUES (@VoteId, @UserId, @PollId, @OptionId);
END;



