-- Data: insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password, name) VALUES
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'admin@acme.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'Alice Admin'),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'bob@acme.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'Bob Builder'),
    ('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'charlie@acme.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'Charlie Chen'),
    ('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'diana@startup.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'Diana Dev'),
    ('c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'evan@startup.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'Evan Engineer'),
    ('d9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'fiona@tech.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'Fiona Finance'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'george@design.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'George Graphics'),
    ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'hannah@design.com', '$2b$10$rQZ8K1YhVzGxqhK0LxZqXe7YZ5vJzGxqhK0LxZqXe7YZ5vJzGxqh', 'Hannah Harper');
