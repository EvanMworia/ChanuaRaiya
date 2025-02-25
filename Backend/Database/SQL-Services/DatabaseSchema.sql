USE CHANUARAIYA
GO
CREATE TABLE Users(
    UserId VARCHAR(255) NOT NULL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Role VARCHAR(255) NOT NULL DEFAULT 'User',
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
)
-- DROP TABLE Users

-- INSERT INTO Users(UserId, Username, Email, Role, PasswordHash)
-- VALUES
-- ('user1', 'Admin', 'admin@test.com', 'Admin', '123'),
-- ('user2', 'Citizen', 'citizen@test.com', 'User', '123')

-- SELECT * FROM Users