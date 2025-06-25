-- Creates the table to store user information
CREATE TABLE "users" (
      "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(255) UNIQUE NOT NULL,
          "password_hash" VARCHAR(255) NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creates the table to store manga/anime series metadata
CREATE TABLE "series" (
      "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
          "cover_path" VARCHAR(255),
            "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE
);

-- Creates the table to track reading progress for each user and series
CREATE TABLE "reading_progress" (
      "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
          "series_id" INTEGER REFERENCES "series"("id") ON DELETE CASCADE,
            "last_read_page" INTEGER NOT NULL,
              "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE("user_id", "series_id")
);

-- You can run this file against your PostgreSQL database using:
-- psql -U your_username -d your_database -f schema.sql
