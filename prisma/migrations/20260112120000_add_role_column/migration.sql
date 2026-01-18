-- Add "role" column to user table, set default 'user' for existing rows
ALTER TABLE "user" ADD COLUMN "role" TEXT;

-- Set existing null roles to 'user'
UPDATE "user" SET "role" = 'user' WHERE "role" IS NULL;

-- Set default to 'user'
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';

-- Optionally make column NOT NULL (uncomment if you want it enforced)
-- ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;
