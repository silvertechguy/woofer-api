BEGIN;

CREATE TABLE users(
  user_id UUID DEFAULT uuid_generate_v4(),
  user_username VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  user_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  user_image_url VARCHAR DEFAULT 'https://firebasestorage.googleapis.com/v0/b/woofer-b53c5.appspot.com/o/no-img.png?alt=media',
  user_bio VARCHAR(255),
  user_website VARCHAR(255),
  user_location VARCHAR(255)
);

COMMIT;