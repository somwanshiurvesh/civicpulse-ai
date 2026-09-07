-- Create sequence for Issue ID generation (CP-YYYY-XXXXXX)
CREATE SEQUENCE IF NOT EXISTS issue_id_seq START WITH 1 INCREMENT BY 1;

-- Create issues table (Strict Day 2 specification: only core fields, lat/lng, and PostGIS location)
CREATE TABLE IF NOT EXISTS issues (
    issue_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    description TEXT NOT NULL,
    category VARCHAR(30) NOT NULL,
    subcategory VARCHAR(30),
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_issue_status CHECK (
        status IN (
            'SUBMITTED',
            'UNDER_REVIEW',
            'VERIFIED',
            'ASSIGNED',
            'IN_PROGRESS',
            'RESOLVED',
            'CLOSED',
            'DUPLICATE',
            'REJECTED'
        )
    ),
    CONSTRAINT chk_issue_category CHECK (
        category IN (
            'ROAD',
            'WASTE',
            'WATER',
            'DRAINAGE',
            'STREETLIGHT',
            'TRAFFIC',
            'PUBLIC_INFRASTRUCTURE',
            'OTHER'
        )
    )
);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_issues_updated_at ON issues;
CREATE TRIGGER trg_issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Spatial GiST Index on location
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues USING GIST(location);

-- Indexes for filtering, sorting, and foreign keys
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at);
