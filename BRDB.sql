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
    idUser        CHAR(20) PRIMARY KEY,
    tagUser       CHAR(80) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    dateEntry     DATE                                              NOT NULL,
    dateNew       DATE                                              NOT NULL,
    messagesTotal BIGINT                                            NOT NULL,
    level         INT                                               NOT NULL,
    idRank        INT                                               NOT NULL
);

--Table RankMembers
CREATE TABLE RankMembers
(
    idRank INT PRIMARY KEY,
    nombre CHAR(40) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL
);

--Table MessagePosition
CREATE TABLE MessagePosition
(
    idUser       CHAR(20) NOT NULL,
    countMessage INT      NOT NULL,
    month        SMALLINT NOT NULL,
    year         SMALLINT NOT NULL
);

--Table Remembers
CREATE TABLE Remembers
(
    idUser        CHAR(20)                                           NOT NULL,
    idRemember    INT PRIMARY KEY,
    dateRemember  CHAR(8)                                            NOT NULL,
    titleRemember CHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    bodyRemember  CHAR(200) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    enable        TINYINT                                            NOT NULL
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

--Table Flags
CREATE TABLE Flags
(
    idUser     CHAR(20),
    rankChange TINYINT
);

--Alter tables
ALTER TABLE Flags
    ADD FOREIGN KEY (idUser) REFERENCES Members (idUser);

ALTER TABLE Remembers
    ADD FOREIGN KEY (idUser) REFERENCES Members (idUser);

ALTER TABLE MessagePosition
    ADD FOREIGN KEY (idUser) REFERENCES Members (idUser);

ALTER TABLE Members
    ADD FOREIGN KEY (idRank) REFERENCES RankMembers (idRank);


--Insert RankMembers
INSERT INTO RankMembers
VALUES (0, N'⭐Nuevo️⭐'),
       (1, N'🍁Nido🍁'),
       (2, N'🥚Huevo🥚'),
       (3, N'🤰Embrion🤰'),
       (4, N'🐣Pollo Bebé🐣'),
       (5, N'📚🐤Pollo estudiante🐤📚'),
       (6, N'👓🐥Pollo adolescente🐥👓'),
       (7, N'🎓🐥Pollo Graduado🐥🎓'),
       (8, N'🐔Gallo🐔'),
       (9, N'🍗Gallo Veterano🍗'),
       (10, N'🥇🐓Gallo de oro🐓🥇');

--Create GetRemember
CREATE
    PROC GetRemember
AS
BEGIN
    DECLARE
        @fecha CHAR(10);

    SET
        @fecha = (SELECT FORMAT(GETDATE(), 'dd/MM/yy'));

    SELECT r.idUser, m.tagUser, r.titleRemember, r.bodyRemember, r.idRemember
    FROM Remembers r
             INNER JOIN Members M on r.idUser = M.idUser
    WHERE r.dateRemember = @fecha
      AND r.enable = 1;
END
GO;

--Exec PROC
EXEC GetRemember;

--Create SetCount
CREATE PROC SetCount(@IdUser CHAR(20), @TagUser VARCHAR(80))
AS
BEGIN
    IF (EXISTS(SELECT 1 FROM Members WHERE idUser = @IdUser))
        BEGIN
            UPDATE Members
            SET messagesTotal = ((SELECT messagesTotal FROM Members WHERE idUser = @IdUser) + 1),
                dateNew       = GETDATE(),
                tagUser       = @TagUser
            WHERE idUser = @IdUser;

            SELECT messagesTotal, level FROM Members WHERE idUser = @IdUser;
        END
    ELSE
        BEGIN
            INSERT INTO Members VALUES (@IdUser, @TagUser, GETDATE(), GETDATE(), 1, 0, 0);
            SELECT messagesTotal, level FROM Members WHERE idUser = @IdUser;
        END
END
GO;

--Exec PROC
EXEC SetCount 340555238874546200, 'Gerbo67#2644'


CREATE PROC SetCountPosition(@IdUser CHAR(20))
AS
BEGIN
    IF (EXISTS(SELECT 1
               FROM MessagePosition
               WHERE idUser = @IdUser
                 AND month = MONTH(GETDATE())
                 AND year = YEAR(GETDATE())))
        BEGIN
            UPDATE MessagePosition
            SET countMessage = (SELECT countMessage
                                FROM MessagePosition
                                WHERE idUser = @IdUser
                                  AND month = MONTH(GETDATE())
                                  AND year = YEAR(GETDATE())) + 1
            WHERE idUser = @IdUser
              AND month = MONTH(GETDATE())
              AND year = YEAR(GETDATE());
        END
    ELSE
        BEGIN
            INSERT INTO MessagePosition VALUES (@IdUser, 1, MONTH(GETDATE()), YEAR(GETDATE()))
        END
END
GO;

CREATE PROC SetFlagRank(@IdUser CHAR(20), @number TINYINT)
AS
BEGIN
    IF (EXISTS(SELECT 1 FROM Flags WHERE idUser = @IdUser))
        BEGIN
            UPDATE Flags SET rankChange = @number WHERE idUser = @IdUser;
        END
    ELSE
        BEGIN
            INSERT INTO Flags VALUES (@IdUser, @number);
        END
END
GO;