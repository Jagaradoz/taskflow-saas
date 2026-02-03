-- Data: clear old data
TRUNCATE memberships, users, organizations RESTART IDENTITY CASCADE;


-- Data: insert sample organizations
INSERT INTO organizations (id, name, slug) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Acme Corp', 'acme-corp'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Startup Inc', 'startup-inc'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Tech Solutions', 'tech-solutions'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Design Studio', 'design-studio');


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


-- Data: insert sample memberships
INSERT INTO memberships (user_id, org_id, role) VALUES
    -- Acme Corp members
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'owner'),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'member'),
    ('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'member'),
    -- Startup Inc members
    ('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'owner'),
    ('c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'member'),
    -- Tech Solutions members
    ('d9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'owner'),
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'member'),
    -- Design Studio members
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'owner'),
    ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'member');
