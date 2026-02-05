-- Data: insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password, name) VALUES
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'alice@acme.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'Alice Owner'),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'bob@acme.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'Bob Builder'),
    ('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'charlie@acme.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'Charlie Chen'),
    ('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'diana@startup.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'Diana Dev'),
    ('c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'evan@startup.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'Evan Engineer'),
    ('d9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'fiona@tech.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'Fiona Finance'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'george@design.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'George Graphics'),
    ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'hannah@design.com', '$2b$10$MgX4Wpv6C.6XuYXIsxWC5OrpcfDej1NrDnDY5ofO1Sc/LxgzFMO8.', 'Hannah Harper');
