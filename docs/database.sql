-- ============================================================
-- DevTrack Pro — Database Setup Script
-- Database: devtrack_pro
-- Run this in phpMyAdmin → SQL tab, or via MySQL CLI
-- ============================================================

USE devtrack_pro;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  client VARCHAR(100),
  status ENUM('Ongoing', 'Completed', 'To Do', 'On Hold', 'Cancelled') DEFAULT 'To Do',
  description TEXT,
  repo VARCHAR(255),
  progress INT DEFAULT 0,
  budget DECIMAL(10,2) DEFAULT 0,
  paid DECIMAL(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  date DATE,
  done BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('Paid', 'Partial', 'Unpaid') DEFAULT 'Unpaid',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: meetings
-- ============================================================
CREATE TABLE IF NOT EXISTS meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  client VARCHAR(100),
  type VARCHAR(100),
  date DATE,
  time VARCHAR(20),
  platform VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- ============================================================
-- SEED DATA — Projects
-- ============================================================
INSERT INTO projects (id, name, client, status, description, repo, progress, budget, paid, start_date, end_date) VALUES
(1, 'E-Commerce Platform',       'ABC Retail Co.',        'Ongoing',   'A full-featured e-commerce platform with product management, cart, and checkout.',           'https://github.com/devtrack/ecommerce-platform', 65,  85000, 55000, '2026-01-10', '2026-06-30'),
(2, 'Hospital Management System','MedCare Clinic',         'Ongoing',   'Comprehensive hospital management with patient records, appointments, and billing.',          'https://github.com/devtrack/hospital-ms',        40, 120000, 40000, '2026-02-01', '2026-09-30'),
(3, 'Portfolio Website',         'Juan Dela Cruz',         'Completed', 'A personal portfolio website showcasing projects, skills, and contact info.',                 'https://github.com/devtrack/portfolio-jdc',     100,  15000, 15000, '2025-11-01', '2025-12-15'),
(4, 'Inventory Management App',  'Sunrise Hardware',       'To Do',     'Desktop-based inventory management system for tracking stock and sales.',                     'https://github.com/devtrack/inventory-app',       5,  60000,     0, '2026-05-01', '2026-10-31'),
(5, 'School LMS',                'Bright Future Academy',  'Completed', 'Learning management system with course management, quizzes, and grade tracking.',             'https://github.com/devtrack/school-lms',        100,  95000, 95000, '2025-07-01', '2025-12-31');

-- ============================================================
-- SEED DATA — Tasks
-- ============================================================
INSERT INTO tasks (project_id, title, done) VALUES
-- Project 1
(1, 'Setup project repository', TRUE),
(1, 'Design wireframes', TRUE),
(1, 'Implement authentication', TRUE),
(1, 'Build product listing page', TRUE),
(1, 'Shopping cart functionality', FALSE),
(1, 'Payment gateway integration', FALSE),
(1, 'Admin dashboard', FALSE),
-- Project 2
(2, 'Database schema design', TRUE),
(2, 'User roles & permissions', TRUE),
(2, 'Patient registration module', FALSE),
(2, 'Appointment scheduling', FALSE),
(2, 'Billing system', FALSE),
-- Project 3
(3, 'Design homepage layout', TRUE),
(3, 'Implement responsive design', TRUE),
(3, 'Add project showcase', TRUE),
(3, 'Contact form integration', TRUE),
(3, 'SEO optimization', TRUE),
-- Project 4
(4, 'Define project scope', TRUE),
(4, 'Create wireframes', FALSE),
(4, 'Setup dev environment', FALSE),
-- Project 5
(5, 'Course creation module', TRUE),
(5, 'Student enrollment', TRUE),
(5, 'Quiz system', TRUE),
(5, 'Grading system', TRUE),
(5, 'Reports & analytics', TRUE);

-- ============================================================
-- SEED DATA — Milestones
-- ============================================================
INSERT INTO milestones (project_id, title, date, done) VALUES
-- Project 1
(1, 'Project Kickoff', '2026-01-10', TRUE),
(1, 'UI/UX Design', '2026-02-01', TRUE),
(1, 'Frontend Development', '2026-03-15', TRUE),
(1, 'Backend Integration', '2026-05-01', FALSE),
(1, 'Testing & QA', '2026-06-01', FALSE),
(1, 'Launch', '2026-06-30', FALSE),
-- Project 2
(2, 'Requirements Gathering', '2026-02-01', TRUE),
(2, 'System Design', '2026-02-28', TRUE),
(2, 'Module 1: Patient Records', '2026-04-15', FALSE),
(2, 'Module 2: Appointments', '2026-06-01', FALSE),
(2, 'Module 3: Billing', '2026-08-01', FALSE),
(2, 'Deployment', '2026-09-30', FALSE),
-- Project 3
(3, 'Design Mockup', '2025-11-07', TRUE),
(3, 'Development', '2025-11-30', TRUE),
(3, 'Client Review', '2025-12-07', TRUE),
(3, 'Launch', '2025-12-15', TRUE),
-- Project 4
(4, 'Project Planning', '2026-05-01', FALSE),
(4, 'Prototype', '2026-06-01', FALSE),
(4, 'Development Phase 1', '2026-08-01', FALSE),
(4, 'Testing', '2026-10-01', FALSE),
(4, 'Delivery', '2026-10-31', FALSE),
-- Project 5
(5, 'Kickoff', '2025-07-01', TRUE),
(5, 'Core Features', '2025-09-30', TRUE),
(5, 'Testing', '2025-11-30', TRUE),
(5, 'Launch', '2025-12-31', TRUE);

-- ============================================================
-- SEED DATA — Payments
-- ============================================================
INSERT INTO payments (project_id, total, paid, status) VALUES
(1, 85000,  55000, 'Partial'),
(2, 120000, 40000, 'Partial'),
(3, 15000,  15000, 'Paid'),
(4, 60000,  0,     'Unpaid'),
(5, 95000,  95000, 'Paid');

-- ============================================================
-- SEED DATA — Meetings
-- ============================================================
INSERT INTO meetings (project_id, client, type, date, time, platform, notes) VALUES
(1, 'ABC Retail Co.',       'Progress Review',        '2026-04-18', '10:00 AM', 'Google Meet',     'Discuss backend integration milestones and review current sprint.'),
(2, 'MedCare Clinic',       'Requirements Discussion', '2026-04-20', '2:00 PM',  'Zoom',            'Clarify patient module requirements and billing system specs.'),
(4, 'Sunrise Hardware',     'Kickoff Meeting',         '2026-04-22', '9:00 AM',  'Microsoft Teams', 'Initial kickoff, discuss scope, timeline, and deliverables.'),
(1, 'ABC Retail Co.',       'Sprint Demo',             '2026-05-05', '3:00 PM',  'Google Meet',     'Demo of shopping cart and checkout features to the client.'),
(2, 'MedCare Clinic',       'Progress Review',         '2026-05-12', '11:00 AM', 'Zoom',            'Review Module 1 completion and plan Module 2 development.');

-- ============================================================
-- Done! All tables created and seed data inserted.
-- ============================================================
