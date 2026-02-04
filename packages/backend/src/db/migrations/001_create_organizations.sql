-- Tables: create organizations table
CREATE TABLE organizations (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255)    NOT NULL,
    slug        VARCHAR(100)    UNIQUE NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ     DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     DEFAULT NOW()
);


-- Indexes: slug index for faster lookups
CREATE INDEX idx_organizations_slug ON organizations(slug);


-- Functions: update updated_at column after manipulation
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Triggers: attach trigger to organizations table
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
