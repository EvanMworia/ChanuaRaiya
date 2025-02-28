USE CHANUARAIYA
GO


CREATE OR ALTER PROCEDURE AddNewIncident
    @IncidentId VARCHAR(255),
    @Location VARCHAR(255),
    @Description VARCHAR(500),
    @MediaURL VARCHAR(500),
    @UserId VARCHAR(255)
AS
BEGIN
    INSERT INTO Incidents (IncidentId, Location, Description, MediaURL, UserId)
    VALUES (@IncidentId, @Location, @Description, @MediaURL, @UserId)
END;