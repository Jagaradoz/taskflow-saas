-- Tables: create membership_requests table for invites and join requests
CREATE TABLE membership_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('invite', 'request')),

    -- Invite-specific (NULL for requests)
    invited_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Request-specific (NULL for invites)
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Shared
    role VARCHAR(10) NOT NULL CHECK (role IN ('member')),
    status VARCHAR(10) NOT NULL DEFAULT 'pending'
           CHECK (status IN ('pending', 'accepted', 'declined', 'rejected', 'revoked')),
    message TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints: ensure type-specific fields are populated correctly
    CONSTRAINT invite_has_user CHECK (type != 'invite' OR invited_user_id IS NOT NULL),
    CONSTRAINT invite_has_inviter CHECK (type != 'invite' OR invited_by IS NOT NULL),
    CONSTRAINT request_has_requester CHECK (type != 'request' OR requester_id IS NOT NULL)
);


-- Indexes: org_id for listing, user-specific for personal views
CREATE INDEX idx_membership_requests_org ON membership_requests(org_id);
CREATE INDEX idx_membership_requests_invited_user ON membership_requests(invited_user_id) WHERE type = 'invite';
CREATE INDEX idx_membership_requests_requester ON membership_requests(requester_id) WHERE type = 'request';


-- Partial unique indexes: prevent duplicate pending invites/requests
CREATE UNIQUE INDEX idx_unique_pending_invite
    ON membership_requests(org_id, invited_user_id)
    WHERE type = 'invite' AND status = 'pending';

CREATE UNIQUE INDEX idx_unique_pending_request
    ON membership_requests(org_id, requester_id)
    WHERE type = 'request' AND status = 'pending';
