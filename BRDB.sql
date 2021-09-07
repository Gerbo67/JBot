CREATE DATABASE BRDB;

USE BRDB;

DROP TABLE Remembers;

CREATE TABLE Members
(
    idUser    BIGINT PRIMARY KEY,
    dateEntry DATE NOT NULL,
);

INSERT INTO Members
VALUES (1218100471, GETDATE());
INSERT INTO Members
VALUES (1218100472, '2021/08/31');

SELECT *
FROM Remembers;

DELETE
FROM Remembers
WHERE idRemember = 46287;


CREATE TABLE Remembers
(
    idRemember    INT PRIMARY KEY,
    dateRemember  CHAR(8)      NOT NULL,
    titleRemember VARCHAR(100) NOT NULL,
    bodyRemember  VARCHAR(200) NOT NULL,
    tagUser       VARCHAR(50)  NOT NULL,
    idUser        VARCHAR(20)  NOT NULL
)

SELECT *
FROM Remembers;

INSERT INTO Remembers
VALUES (48596, '08/09/21', 'Recordatorio 08', 'Ejemplo de prueba', 'Gerbo67#2644', '340555238874546178')

CREATE PROC GetRemember
AS
BEGIN
    DECLARE @fecha CHAR(10);

    SET @fecha = (SELECT FORMAT(GETDATE(), 'dd/MM/yy'));

    SELECT * FROM Remembers WHERE dateRemember = @fecha;

END

    EXEC GetRemember;

SELECT GETDATE();