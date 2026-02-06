-- Fix: expand role CHECK constraint to allow 'owner' in addition to 'member'
-- This enables org owners to approve join requests with an 'owner' role assignment
ALTER TABLE membership_requests
    DROP CONSTRAINT IF EXISTS membership_requests_role_check;

ALTER TABLE membership_requests
    ADD CONSTRAINT membership_requests_role_check
    CHECK (role IN ('owner', 'member'));
