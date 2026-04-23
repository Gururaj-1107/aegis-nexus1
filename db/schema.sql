CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- NGO Centers
CREATE TABLE ngo_centers (
    center_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL
);

-- Volunteers
CREATE TABLE volunteers (
    volunteer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    current_lat DOUBLE PRECISION NOT NULL,
    current_lng DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE' -- AVAILABLE, DISPATCHED, OFFLINE
);

-- Skills (Standardized taxonomy)
CREATE TABLE skills (
    skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(100) NOT NULL UNIQUE
);

-- Volunteer_Skills (BCNF intersection table)
CREATE TABLE volunteer_skills (
    volunteer_id UUID REFERENCES volunteers(volunteer_id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, skill_id)
);

-- Reports (Parsed from Document AI / Voice)
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES ngo_centers(center_id) ON DELETE SET NULL,
    description TEXT,
    urgency_level VARCHAR(50) NOT NULL, -- LOW, MEDIUM, CRITICAL
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Assignments (Mapping specific reports directly to volunteers)
CREATE TABLE assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES volunteers(volunteer_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eta_minutes INT,
    status VARCHAR(50) DEFAULT 'EN_ROUTE' -- EN_ROUTE, ARRIVED, COMPLETED
);
