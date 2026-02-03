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
