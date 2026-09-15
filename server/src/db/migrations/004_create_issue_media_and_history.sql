-- Create issue_media table
CREATE TABLE IF NOT EXISTS issue_media (
    id SERIAL PRIMARY KEY,
    issue_id VARCHAR(20) NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_issue_media_issue_id ON issue_media(issue_id);

-- Create issue_status_history table
CREATE TABLE IF NOT EXISTS issue_status_history (
    id SERIAL PRIMARY KEY,
    issue_id VARCHAR(20) NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(50) REFERENCES users(id),
    comments TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_history_status CHECK (
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
    )
);

CREATE INDEX IF NOT EXISTS idx_issue_status_history_issue_id ON issue_status_history(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_status_history_changed_at ON issue_status_history(changed_at);
