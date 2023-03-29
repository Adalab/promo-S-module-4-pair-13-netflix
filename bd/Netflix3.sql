CREATE DATABASE Netflix;
USE Netflix;

CREATE TABLE movies (
	idMovies int auto_increment not null primary key,
    title varchar(45) not null,
    gender varchar(45) not null,
    image varchar(1000) not null,
	category varchar(45) not null,
    year year
);

CREATE TABLE users (
	idUser int auto_increment not null primary key,
    user varchar(45) not null,
    password varchar(45) not null,
    name varchar(45) not null,
    email varchar(45) not null,
    plan_details varchar(45) not null
);


CREATE TABLE Actors (
	idActor int auto_increment primary key,
    name varchar(45) not null,
    lastname varchar(45) not null,
    country varchar(45) not null,
    birthday date
);


INSERT INTO movies (title, gender, image, category, year) VALUES
("Pulp Fiction", "Crimen", "https://pics.filmaffinity.com/pulp_fiction-210382116-large.jpg", "Top 10", "1994"),
("La vita è bella", "Comedia", "https://pics.filmaffinity.com/la_vita_e_bella-646167341-mmed.jpg", "Top 10", "1996"),
("Forrest Gump", "Comedia", "https://pics.filmaffinity.com/forrest_gump-212765827-mmed.jpg", "Top 10", "1994");

INSERT INTO users (user, password, name, email, plan_details) VALUES
("laura_dev", "laura", "Laura", "laura@gmail.com", "Standard"),
("maria_dev", "maria", "Maria", "maria@gmail.com", "Standard"),
("ester_dev", "ester", "Ester", "ester@gmail.com", "Standard");

INSERT INTO actors (name, lastname, country, birthday) VALUES
("Tom", "Hanks", "Estados Unidos", "1956-06-09"),
("Roberto", "Benigni", "Italia", "1952-10-27"),
("John", "Travolta", "Estados Unidos", "1954-02-18");

SELECT * FROM movies;

SELECT title, gender FROM movies 
WHERE year >= 1990;

SELECT * FROM movies
WHERE category IN ("Top 10");

UPDATE movies SET year = "1997"
WHERE title = "La vita è bella";

SELECT * FROM Actors;

SELECT * FROM Actors
WHERE birthday BETWEEN "1950-01-01" AND "1960-12-31";

SELECT name, lastname FROM Actors
WHERE country = "Estados Unidos";

SELECT * FROM users
WHERE plan_details = "Standard";

DELETE FROM users
WHERE name LIKE 'm%';

SELECT * FROM users;

ALTER TABLE Actors
ADD image VARCHAR(1000);

SELECT * FROM Actors;

CREATE TABLE rel_movies_users (
id int not null auto_increment primary key,
fkMovie int not null,
fkUser int not null,
FOREIGN KEY (fkMovie) REFERENCES movies(idMovies),
FOREIGN KEY (fkUser) REFERENCES users(idUser) 
);

SELECT * FROM movies;
SELECT * FROM rel_movies_users;

INSERT INTO rel_movies_users (fkUser, fkMovie) VALUES
(1,1), (1,2), (2,2);

CREATE TABLE rel_actors_movies (
id int not null auto_increment primary key,
fkMovie int not null,
fkActor int not null
);

INSERT INTO rel_actors_movies (fkActor, fkMovie) VALUES
(1,3), (2,2), (3,1);

SELECT Actors.name, movies.title
FROM Actors INNER JOIN rel_actors_movies
ON Actors.idActor = rel_actors_movies.fkActor
INNER JOIN movies 
ON movies.idMovies = rel_actors_movies.fkMovie;



