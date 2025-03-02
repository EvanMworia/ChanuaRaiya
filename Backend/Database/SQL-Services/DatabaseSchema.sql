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
GO
USE CHANUARAIYA
CREATE TABLE Topics(
    TopicId VARCHAR(255) NOT NULL PRIMARY KEY,
    Title VARCHAR(350) NOT NULL,
    Context VARCHAR(2500) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
)
GO
CREATE TABLE Views(
    ViewId VARCHAR(255) NOT NULL PRIMARY KEY,
    Opinion VARCHAR(1600) NOT NULL,
    UserId VARCHAR(255) FOREIGN KEY REFERENCES Users(UserId),
    TopicId VARCHAR(255) NOT NULL FOREIGN KEY REFERENCES Topics(TopicId) ON DELETE CASCADE
)

CREATE TABLE Polls (
    PollId VARCHAR(255) PRIMARY KEY,----- GIVEN BY US
    Question VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
USE CHANUARAIYA
CREATE TABLE PollOptions (
    OptionId INT PRIMARY KEY IDENTITY, --id of the poll choice ----- GIVEN BY DB
    PollId VARCHAR(255) NOT NULL,
    OptionText VARCHAR(255) NOT NULL, -- name of the poll choice
    FOREIGN KEY (PollId) REFERENCES Polls(PollId) ON DELETE CASCADE
);

CREATE TABLE UserPollVotes (
    VoteId VARCHAR(255) PRIMARY KEY, ----- GIVEN BY US
    UserId VARCHAR(255) NOT NULL, --from users table
    PollId VARCHAR(255) NOT NULL, -- the poll id
    OptionId INT NOT NULL, -- the choice selected
    VotedAt DATETIME DEFAULT GETDATE(),
    UNIQUE (UserId, PollId),  -- Ensures a user votes only once per poll
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (PollId) REFERENCES Polls(PollId) ON DELETE CASCADE,
    FOREIGN KEY (OptionId) REFERENCES PollOptions(OptionId) 
);

CREATE TABLE Incidents (
    IncidentId VARCHAR(255) PRIMARY KEY,
    Location VARCHAR(255) NOT NULL,
    Description VARCHAR(500) NOT NULL,
    MediaURL VARCHAR(500),
    UserId VARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Documents (
    DocumentId VARCHAR(255) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description VARCHAR(500) NOT NULL,
    DocumentURL VARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    
);

