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
    month        CHAR     NOT NULL,
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
    FROM Remembers r INNER JOIN Members M on r.idUser = M.idUser
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


SELECT *
FROM INFORMATION_SCHEMA.TABLES;

--Insert Members
SELECT *
FROM Members

INSERT INTO Members
VALUES ('', N'', '', '', 0, 0, 0);

INSERT INTO Members
VALUES ('127832898282717184', N'Caru#7614', '2021-09-27', '2021-09-28', 10, 0, 0);
INSERT INTO Members
VALUES ('134383103698272256', N'Kuro#6592', '2021-09-28', '2021-09-28', 32, 0, 0);
INSERT INTO Members
VALUES ('186286514752192512', N'WolfStranger#6331', '2021-09-26', '2021-09-28', 554, 0, 0);
INSERT INTO Members
VALUES ('216689055050498049', N'peanuts#7257', '2021-09-24', '2021-09-28', 182, 0, 0);
INSERT INTO Members
VALUES ('252637923827122176', N'Sahhe#8875', '2021-09-28', '2021-09-28', 4, 0, 0);
INSERT INTO Members
VALUES ('256985609875357707', N'HDM#0077', '2021-09-24', '2021-09-24', 1, 0, 0);
INSERT INTO Members
VALUES ('271390921101279232', N'Zethos#8305', '2021-09-16', '2021-09-16', 1, 0, 0);
INSERT INTO Members
VALUES ('276091960115331075', N'NicoNi#4827', '2021-09-17', '2021-09-28', 12, 0, 0);
INSERT INTO Members
VALUES ('278646923337138181', N'PINOCHACO#1365', '2021-09-14', '2021-09-23', 2, 0, 0);
INSERT INTO Members
VALUES ('446127885015580684', N'ToñitoElip#5584', '2021-09-14', '2021-09-14', 0, 0, 0);
INSERT INTO Members
VALUES ('291407568734257153', N'Brosito#9679', '2021-09-15', '2021-09-28', 12, 0, 0);
INSERT INTO Members
VALUES ('308380642498969605', N'RyuK3y#8030', '2021-09-14', '2021-09-21', 9, 0, 0);
INSERT INTO Members
VALUES ('882110102440669264', N'Noel Chavez#6108', '2021-09-08', '2021-09-14', 0, 0, 0);
INSERT INTO Members
VALUES ('323595408381181953', N'matioliveros#1600', '2021-09-26', '2021-09-26', 13, 0, 0);
INSERT INTO Members
VALUES ('323928986457604097', N'TheGodMolina#2560', '2021-09-22', '2021-09-22', 9, 0, 0);
INSERT INTO Members
VALUES ('339394234375340042', N't0x1cks#5673', '2021-09-23', '2021-09-23', 1, 0, 0);
INSERT INTO Members
VALUES ('340555238874546178', N'Gerbo67#2644', '2021-09-15', '2021-09-28', 250, 0, 0);
INSERT INTO Members
VALUES ('393168815023849473', N'T.F#8864', '2021-09-13', '2021-09-14', 0, 0, 0);
INSERT INTO Members
VALUES ('426324024029872130', N'CarlitosLaguna#2738', '2021-09-22', '2021-09-28', 15, 0, 0);
INSERT INTO Members
VALUES ('486258097023746068', N'KNRZ#3514', '2021-09-14', '2021-09-14', 0, 0, 0);
INSERT INTO Members
VALUES ('469345756977954816', N'pbraca21#8474', '2021-09-15', '2021-09-15', 2, 0, 0);
INSERT INTO Members
VALUES ('605141562451689492', N'JEIJEY (MWNZR)#4237', '2021-09-14', '2021-09-14', 0, 0, 0);
INSERT INTO Members
VALUES ('486563935026151444', N'Ema#8797', '2021-09-15', '2021-09-15', 0, 0, 0);
INSERT INTO Members
VALUES ('494641513511387136', N'Bracho69#7501', '2021-09-28', '2021-09-28', 52, 0, 0);
INSERT INTO Members
VALUES ('506490188709625868', N'Jonycabesa#8048', '2021-09-15', '2021-09-17', 2, 0, 0);
INSERT INTO Members
VALUES ('537503418156318731', N'꧁༒⫷𝖘𝖒𝖎𝖑𝖎𝖓𝖌 𝖈𝖔𝖋𝖋𝖎𝖓⫸༒꧂#6222', '2021-09-27', '2021-09-28', 5, 0, 0);
INSERT INTO Members
VALUES ('558706512193650706', N'Bro#2226', '2021-09-15', '2021-09-28', 270, 0, 0);
INSERT INTO Members
VALUES ('561395361093255189', N'TheKillerAlf#2881', '2021-09-26', '2021-09-27', 5, 0, 0);
INSERT INTO Members
VALUES ('588549510230441994', N'DeLosSantos#7589', '2021-09-27', '2021-09-28', 5, 0, 0);
INSERT INTO Members
VALUES ('637805687187177483', N'Victor-#6072', '2021-09-27', '2021-09-27', 85, 0, 0);
INSERT INTO Members
VALUES ('659588690833702932', N'aganamen#6223', '2021-09-26', '2021-09-28', 41, 0, 0);
INSERT INTO Members
VALUES ('687025837194870816', N'JesusB.RTP5173#5778', '2021-09-26', '2021-09-26', 4, 0, 0);
INSERT INTO Members
VALUES ('690251145272361000', N'SebastianGs#6034', '2021-09-28', '2021-09-28', 1, 0, 0);
INSERT INTO Members
VALUES ('696835704554127440', N'PequeñoSnow#1408', '2021-09-28', '2021-09-28', 46, 0, 0);
INSERT INTO Members
VALUES ('700792026886701067', N'Malheven#1114', '2021-09-28', '2021-09-28', 4, 0, 0);
INSERT INTO Members
VALUES ('716334206807965800', N'wilker#0380', '2021-09-28', '2021-09-28', 2, 0, 0);
INSERT INTO Members
VALUES ('744546561765146624', N'zzzzzzzzz#9672', '2021-09-18', '2021-09-18', 1, 0, 0);
INSERT INTO Members
VALUES ('845760766912757791', N'ale_19#6033', '2021-09-28', '2021-09-28', 3, 0, 0);
INSERT INTO Members
VALUES ('866781341676339211', N'Jose Gabriel#8335', '2021-09-17', '2021-09-17', 2, 0, 0);
INSERT INTO Members
VALUES ('870792939939463218', N'Sandino#7714', '2021-09-28', '2021-09-28', 1, 0, 0);
INSERT INTO Members
VALUES ('872571128781086740', N'kalvario7x3#8058', '2021-09-28', '2021-09-28', 1, 0, 0);
INSERT INTO Members
VALUES ('784604496521068554', N'9iNe#8292', '2021-09-14', '2021-09-14', 0, 0, 0);
INSERT INTO Members
VALUES ('878956736780857364', N'dj_noni#4762', '2021-09-18', '2021-09-19', 3, 0, 0);
INSERT INTO Members
VALUES ('880934454892322826', N'juanpp#8361', '2021-09-15', '2021-09-22', 5, 0, 0);
INSERT INTO Members
VALUES ('883681234818039838', N'Satree#3238', '2021-09-08', '2021-09-14', 0, 0, 0);
INSERT INTO Members
VALUES ('885174754129084437', N'cerami71#2182', '2021-09-15', '2021-09-28', 16, 0, 0);


INSERT INTO Remembers
VALUES ('340555238874546178', 15967, '16/09/21', N'Una nueva prueba', N'Aqui va algo', 0);
INSERT INTO Remembers
VALUES ('558706512193650706', 29625, '17/09/21', N'Token cars', N'salen el token de cryptocars', 0);
INSERT INTO Remembers
VALUES ('558706512193650706', 44187, '16/09/21', N'gremio yt', N'streamdungeons', 0);
INSERT INTO Remembers
VALUES ('340555238874546178', 50373, '15/09/21', N'Hola', N'Aqui', 0);

INSERT INTO MessagesEntry
VALUES (N'En este servidor es dedicado a los juegos **Play to Earn**, por favor de leer las reglas para no tener inconvenientes, solo queda decirte que disfrutes tu estadía.',
        N'Estamos ansiosos de conocerte',
        N'Estos son los juegos que jugamos actualmente:',
        N'Puedes recomendar algun otro juego 🤗',
        N'Mis Redes sociales');

INSERT INTO MessageEntryGames
VALUES (N'Plant vs Undead 🌷',
        N'Compra semillas, cuida plantas, se un jardinero, las plantas tienen un valor en el mercado así que a darles amor 💖'),
       (N'Axis Infinity 👾',
        N'Juego de cartas de estrategia 2D, cada axie tiene sus cartas, arma estrategia para vencer al enemigo y gana recompensas económicas 💵💵'),
       (N'Splinterlands 🃏',
        N'Colecciona e intercambia cartas, cada una tiene un valor en el mercado y puedes jugar con ellas para farmear dinerito 🤑');

UPDATE Members
SET messagesTotal = 200,
    level         = 0,
    idRank        = 0
WHERE idUser = '340555238874546178';

SELECT messagesTotal, level, idRank
FROM Members
WHERE idUser = '340555238874546178';

--4200

SELECT * FROM Members


SELECT ROW_NUMBER()                       over (ORDER BY MP.countMessage DESC) as numberPosition, m.idUser,
       m.tagUser,
       FORMAT(m.dateEntry, 'dd/MM/yy') as dateEntry,
       m.messagesTotal,
       MP.countMessage,
       m.level,
       RM.idRank,
       RM.nombre
FROM Members m
         INNER JOIN RankMembers RM on m.idRank = RM.idRank
         INNER JOIN MessagePosition MP on m.idUser = MP.idUser
WHERE MP.month = MONTH (GETDATE())
  AND MP.year = YEAR (GETDATE())
