-----Production-----
--Delete DATABASE
DROP
    DATABASE BRDB;

--Create DATABASE
CREATE
    DATABASE BRDB;

--Use DATABASE
USE
    BRDB;
---------Dev---------
--Delete DATABASE
DROP
    DATABASE BRDBTest;

--Create DATABASE
CREATE
    DATABASE BRDBTest;

--Use DATABASE
USE
    BRDBTest;
----------------------
--Table Members
CREATE TABLE Members
(
    idUser        BIGINT PRIMARY KEY,
    tagUser       VARCHAR(100) NOT NULL,
    dateEntry     DATE         NOT NULL,
    dateNew       DATE         NOT NULL,
    messagesTotal BIGINT       NOT NULL,
);

--Table Remembers
CREATE TABLE Remembers
(
    idRemember    INT PRIMARY KEY,
    dateRemember  CHAR(8)      NOT NULL,
    titleRemember VARCHAR(100) NOT NULL,
    bodyRemember  VARCHAR(200) NOT NULL,
    tagUser       VARCHAR(50)  NOT NULL,
    idUser        VARCHAR(20)  NOT NULL,
    enable        TINYINT      NOT NULL
);

--Table MessagesEntry
CREATE TABLE MessagesEntry
(
    cardWelcomeBody   CHAR(400) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    cardWelcomeFooter CHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    cardGamesTitle    CHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    cardGamesFooter   CHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    cardSocialTitle   CHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL
);

--Table MessagesEntry
CREATE TABLE MessageEntryGames
(
    idGame      INT IDENTITY (100,1)                               NOT NULL,
    nameGame    CHAR(80) COLLATE Latin1_General_100_CI_AI_SC_UTF8  NOT NULL,
    description CHAR(150) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
);

--Create GetRemember
CREATE
    PROC GetRemember
AS
BEGIN
    DECLARE
        @fecha CHAR(10);

    SET
        @fecha = (SELECT FORMAT(GETDATE(), 'dd/MM/yy'));

    SELECT *
    FROM Remembers
    WHERE dateRemember = @fecha
      AND enable = 1;
END
GO;

--Exec PROC
EXEC GetRemember;

--Create SetCount
ALTER PROC SetCount(@IdUser BIGINT, @TagUser VARCHAR(100))
AS
BEGIN
    IF (EXISTS(SELECT 1 FROM Members WHERE idUser = @IdUser))
        BEGIN
            UPDATE Members
            SET messagesTotal = ((SELECT messagesTotal FROM Members WHERE idUser = @IdUser) + 1),
                dateNew       = GETDATE(),
                tagUser       = @TagUser
            WHERE idUser = @IdUser;
        END
    ELSE
        BEGIN
            INSERT INTO Members VALUES (@IdUser, @TagUser, GETDATE(), GETDATE(), 1);
        END
END
GO;

--Exec PROC
EXEC SetCount