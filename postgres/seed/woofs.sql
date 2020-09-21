BEGIN;

INSERT INTO woofs(woof_body, username) VALUES ('This is woof #1 by Khaled', 'khaled');
INSERT INTO woofs(woof_body, username) VALUES ('This is woof #2 by Khaled', 'khaled');
INSERT INTO woofs(woof_body, username) VALUES ('This is woof #1 by Ahmed', 'ahmed');
INSERT INTO woofs(woof_body, username) VALUES ('This is woof #2 by Ahmed', 'ahmed');

COMMIT;