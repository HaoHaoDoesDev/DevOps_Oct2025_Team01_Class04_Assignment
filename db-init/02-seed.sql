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
