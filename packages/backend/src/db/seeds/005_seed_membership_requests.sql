-- Data: insert sample membership requests (invites and join requests)
INSERT INTO membership_requests (id, org_id, type, invited_user_id, invited_by, requester_id, role, status, message, resolved_at, resolved_by) VALUES
    -- Pending invites
    -- Diana (Startup Inc owner) invites Alice to join Startup Inc as member
    ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'invite', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', NULL, 'member', 'pending', 'We would love to have you on our team!', NULL, NULL),
    -- Alice (Acme Corp owner) invites Diana to join Acme Corp as member
    ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380d02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'invite', 'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', NULL, 'member', 'pending', NULL, NULL, NULL),

    -- Pending join requests
    -- Hannah requests to join Tech Solutions
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'request', NULL, NULL, 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'member', 'pending', 'I would like to contribute to your team.', NULL, NULL),
    -- Evan requests to join Acme Corp
    ('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'request', NULL, NULL, 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'member', 'pending', 'Looking forward to collaborating!', NULL, NULL),

    -- Accepted invite (historical)
    -- Fiona (Tech Solutions owner) invited Alice to Tech Solutions (now a member there)
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380d21', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'invite', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', NULL, 'member', 'accepted', 'Welcome to Tech Solutions!', NOW() - INTERVAL '7 days', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),

    -- Declined invite (historical)
    -- George (Design Studio owner) invited Evan, but he declined
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380d22', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'invite', 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', NULL, 'member', 'declined', 'Join our creative team!', NOW() - INTERVAL '3 days', 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99'),

    -- Rejected request (historical)
    -- Charlie requested to join Startup Inc but was rejected
    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380d31', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'request', NULL, NULL, 'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'member', 'rejected', 'I have experience in startups.', NOW() - INTERVAL '5 days', 'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88');
