CREATE OR REPLACE FUNCTION generate_unique_user_id() RETURNS INTEGER AS $$
DECLARE
    new_id INTEGER;
    done BOOLEAN DEFAULT FALSE;
BEGIN
    WHILE NOT done LOOP
        new_id := floor(random() * (999999999 - 100000000 + 1) + 100000000)::INTEGER;
        
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = new_id) THEN
            done := TRUE;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE users ALTER COLUMN id SET DEFAULT generate_unique_user_id();

INSERT INTO users (email, password_hash, role)
VALUES (
    'admin@gmail.com', 
    '$2b$10$ijLYAPvWd6wWrvnF6dJxI.Wpgm6QSwCK09IQn.D4usk0ONrQGcTtG', 
    'ADMIN'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, role)
VALUES (
    'user@gmail.com', 
    '$2b$10$bsy5GFsgsXQAmWpYOSYbh.ZynWAqRM4O6IQmviWyJ4GVw04wGLhV6', 
    'USER'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, role)
VALUES (
    'user1@gmail.com', 
    '$2b$10$yVUr4lHXkVQGRb5xBBye3e1dad7pJTKl06nHs8T5q9oGIdvZzUajK', 
    'USER'
)
ON CONFLICT (email) DO NOTHING;