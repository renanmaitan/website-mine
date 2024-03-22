USE Pycodebr;

CREATE TABLE users (
    id INTEGER NOT NULL AUTO_INCREMENT,
    user VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    plano INT NOT NULL DEFAULT 0,
    nickname VARCHAR(100),
    PRIMARY KEY (id),
    group VARCHAR(100) NOT NULL DEFAULT 'user'
);

SET character_set_client = utf8;
SET character_set_connection = utf8;
SET character_set_results = utf8;
SET collation_connection = utf8_general_ci;