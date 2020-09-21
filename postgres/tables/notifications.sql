BEGIN;

CREATE TABLE notifications(
  notification_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  notification_type VARCHAR(255) NOT NULL,
  notification_type_id UUID NOT NULL,
  notification_read BOOLEAN DEFAULT FALSE NOT NULL,
  notification_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  notification_recipient VARCHAR(255) NOT NULL,
  notification_sender VARCHAR(255) NOT NULL,
  notification_woof_id UUID NOT NULL
);

COMMIT;