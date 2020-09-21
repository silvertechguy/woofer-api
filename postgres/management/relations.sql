BEGIN;

ALTER TABLE woofs ADD CONSTRAINT woofs_username_fkey FOREIGN KEY (username) REFERENCES users(user_username) ON DELETE CASCADE;

ALTER TABLE likes ADD CONSTRAINT likes_username_fkey FOREIGN KEY (username) REFERENCES users(user_username) ON DELETE CASCADE;
ALTER TABLE likes ADD CONSTRAINT likes_woof_id_fkey FOREIGN KEY (woof_id) REFERENCES woofs(woof_id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_username_fkey FOREIGN KEY (username) REFERENCES users(user_username) ON DELETE CASCADE;
ALTER TABLE comments ADD CONSTRAINT comments_woof_id_fkey FOREIGN KEY (woof_id) REFERENCES woofs(woof_id) ON DELETE CASCADE;

ALTER TABLE notifications ADD CONSTRAINT notifications_notification_recipient_fkey FOREIGN KEY (notification_recipient) REFERENCES users(user_username) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT notifications_notification_sender_fkey FOREIGN KEY (notification_sender) REFERENCES users(user_username) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT notifications_notification_woof_id_fkey FOREIGN KEY (notification_woof_id) REFERENCES woofs(woof_id) ON DELETE CASCADE;


COMMIT;