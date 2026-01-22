CREATE OR REPLACE FUNCTION generate_random_id() RETURNS INTEGER AS $$
BEGIN
    RETURN floor(random() * (999999999 - 100000000 + 1) + 100000000)::INTEGER;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE users ALTER COLUMN id SET DEFAULT generate_random_id();

INSERT INTO users (email, password_hash, role)
VALUES (
    'admin@gmail.com', 
    '$2b$10$ijLYAPvWd6wWrvnF6dJxI.Wpgm6QSwCK09IQn.D4usk0ONrQGcTtG', 
    'ADMIN'
);