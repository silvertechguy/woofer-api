BEGIN;

CREATE TABLE likes(
  like_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  like_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  woof_id UUID NOT NULL,
  username VARCHAR(255) NOT NULL
);

COMMIT;