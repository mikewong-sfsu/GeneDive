PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "user" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "email" VARCHAR UNIQUE , "password" VARCHAR, "name" VARCHAR, "organization" VARCHAR, "title" VARCHAR, "role" VARCHAR, "usage" VARCHAR, "reset_token" VARCHAR, reset_expiry INTEGER);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('user',63);
COMMIT;
