BEGIN;

INSERT INTO users(user_username, user_email, user_password, user_bio, user_website, user_location) VALUES ('ali', 'ali@ex.com', '$2a$10$VbjPAmQaDMGRLkMT.ibSseo6AYSU5tb9/NoGbX5SsC7EQCC0.Hx6m', 'I am Ali Fadda', 'ali.com', 'Cairo');
INSERT INTO users(user_username, user_email, user_password, user_bio, user_location) VALUES ('khaled', 'khaled@ex.com', '$2a$10$VbjPAmQaDMGRLkMT.ibSseo6AYSU5tb9/NoGbX5SsC7EQCC0.Hx6m', 'I am Khaled', 'Giza');
INSERT INTO users(user_username, user_email, user_password, user_bio, user_website) VALUES ('ahmed', 'ahmed@ex.com', '$2a$10$VbjPAmQaDMGRLkMT.ibSseo6AYSU5tb9/NoGbX5SsC7EQCC0.Hx6m', 'I am Ahmed', 'ahmed.com');
INSERT INTO users(user_username, user_email, user_password) VALUES ('zizo', 'zizo@ex.com', '$2a$10$VbjPAmQaDMGRLkMT.ibSseo6AYSU5tb9/NoGbX5SsC7EQCC0.Hx6m');

COMMIT;