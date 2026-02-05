-- Data: insert sample tasks
INSERT INTO tasks (id, org_id, created_by, title, description, is_done, is_pinned) VALUES
    -- Acme Corp tasks (created by different users)
    ('5d117498-8c10-4107-b236-407425164f01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Review Q1 budget proposal', 'Analyze spending trends and prepare recommendations for the board meeting', FALSE, TRUE),
    ('9b3c4f71-2e8d-4a9b-8c5e-6d1f7e3b9a2c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Schedule team meeting', 'Weekly sync to discuss project milestones', FALSE, FALSE),
    ('7a2b9c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Update project documentation', NULL, TRUE, FALSE),
    ('e8f1a2b3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Fix login page bug', 'Users report session timeout after 5 minutes of inactivity', FALSE, TRUE),
    ('1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Deploy staging environment', 'Set up CI/CD pipeline for staging branch', TRUE, FALSE),
    -- Startup Inc tasks
    ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Pitch deck for investors', 'Prepare 10-slide deck for Series A round', FALSE, TRUE),
    ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Implement payment gateway', 'Integrate Stripe for subscription billing', FALSE, FALSE),
    ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Review competitor analysis', NULL, TRUE, FALSE),
    -- Tech Solutions tasks
    ('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'Client onboarding checklist', 'Step-by-step guide for new enterprise clients', FALSE, TRUE),
    ('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Database optimization', 'Add indexes for slow queries identified in APM', FALSE, FALSE),
    -- Design Studio tasks
    ('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'Logo redesign for client', 'Modern minimalist style with vibrant colors', FALSE, TRUE),
    ('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'Create brand guidelines', 'Include typography, color palette, and usage rules', FALSE, FALSE),
    ('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'Review portfolio website', NULL, TRUE, FALSE);
