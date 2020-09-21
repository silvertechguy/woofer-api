BEGIN;

\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/utils/extensions.sql

\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/tables/notifications.sql
\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/tables/comments.sql
\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/tables/likes.sql
\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/tables/woofs.sql
\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/tables/users.sql

\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/seed/woofs.sql
\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/seed/users.sql

\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/management/relations.sql

\i C:/Users/SilverGuy/Desktop/app/woofer-api/postgres/triggers/notifications.sql

COMMIT;