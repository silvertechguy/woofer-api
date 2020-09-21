BEGIN;

CREATE TABLE comments(
  comment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_body VARCHAR(255) NOT NULL,
  comment_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  woof_id UUID NOT NULL,
  username VARCHAR(255) NOT NULL
);

COMMIT;