USE CHANUARAIYA
GO
CREATE OR ALTER PROCEDURE GetUserById(@UserId VARCHAR(255))
AS
BEGIN
    SELECT * FROM Users WHERE UserId = @UserId
END