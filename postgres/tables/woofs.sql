BEGIN;

CREATE TABLE woofs(
  woof_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  woof_body VARCHAR NOT NULL,
  woof_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  username VARCHAR(255) NOT NULL
);

COMMIT;