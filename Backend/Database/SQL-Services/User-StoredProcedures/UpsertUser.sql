USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE UpsertUser(
    @UserId VARCHAR(255),
    @Username VARCHAR(255),
    @Email VARCHAR(255),
    @PasswordHash VARCHAR(255))

    AS
    BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE UserId=@UserId)
    BEGIN
        UPDATE Users
        SET Username=@Username, Email = @Email, PasswordHash=@PasswordHash
        WHERE UserId=@UserId
    END
    ELSE
    BEGIN
        INSERT INTO Users (UserId, Username, Email, PasswordHash)
        VALUES (@UserId, @Username, @Email, @PasswordHash)
    END
    END

    