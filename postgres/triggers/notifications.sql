BEGIN;

-- like
-- function
CREATE OR REPLACE FUNCTION create_notification_on_like_func ()
  RETURNS TRIGGER
  AS $BODY$
  
DECLARE
  recipient varchar(255);

BEGIN
  SELECT username INTO recipient FROM woofs WHERE woof_id = NEW.woof_id;

  INSERT INTO notifications (notification_recipient, notification_sender, notification_type, notification_type_id, notification_woof_id) VALUES (recipient, NEW.username, 'like', NEW.like_id, NEW.woof_id);
  
  RETURN NEW;
END;
$BODY$
LANGUAGE PLPGSQL;

-- trigger
CREATE TRIGGER create_notification_on_like_trigger
  BEFORE INSERT ON likes
  FOR EACH ROW
  EXECUTE PROCEDURE create_notification_on_like_func ();



-- comment
-- function
CREATE OR REPLACE FUNCTION create_notification_on_comment_func ()
  RETURNS TRIGGER
  AS $BODY$

DECLARE
  recipient varchar(255);

BEGIN
  SELECT username INTO recipient FROM woofs WHERE woof_id = NEW.woof_id;

  INSERT INTO notifications (notification_recipient, notification_sender, notification_type, notification_type_id, notification_woof_id) VALUES (recipient, NEW.username, 'comment', NEW.comment_id, NEW.woof_id);
  
  RETURN NEW;
END;
$BODY$
LANGUAGE PLPGSQL;

-- trigger
CREATE TRIGGER create_notification_on_comment_trigger
  BEFORE INSERT ON comments
  FOR EACH ROW
  EXECUTE PROCEDURE create_notification_on_comment_func ();


-- unlike
-- function
CREATE OR REPLACE FUNCTION delete_notification_on_like_func ()
  RETURNS TRIGGER
  AS $BODY$

BEGIN
  DELETE FROM notifications WHERE notification_type_id = OLD.like_id;
  
  RETURN OLD;
END;
$BODY$
LANGUAGE PLPGSQL;

-- trigger
CREATE TRIGGER delete_notification_on_like_trigger
  BEFORE DELETE ON likes
  FOR EACH ROW
  EXECUTE PROCEDURE delete_notification_on_like_func ();


-- uncomment
-- function
CREATE OR REPLACE FUNCTION delete_notification_on_comment_func ()
  RETURNS TRIGGER
  AS $BODY$

BEGIN
  DELETE FROM notifications WHERE notification_type_id = OLD.comment_id;
  
  RETURN OLD;
END;
$BODY$
LANGUAGE PLPGSQL;

-- trigger
CREATE TRIGGER delete_notification_on_comment_trigger
  BEFORE DELETE ON comments
  FOR EACH ROW
  EXECUTE PROCEDURE delete_notification_on_comment_func ();


COMMIT;