-- Create default admin and customer users
INSERT INTO users (id, username, email, password, role, status, created_at, updated_at) VALUES
('admin-001', 'admin', 'admin@ezyclo.com', '$2a$10$N.zmdr9k7uOsF5hgwVLoOOhFvjzOVdI52jKcYEKSYKpTRq8VfvqKe', 'ADMIN', 'ACTIVE', NOW(), NOW()),
('user-001', 'customer', 'customer@ezyclo.com', '$2a$10$N.zmdr9k7uOsF5hgwVLoOOhFvjzOVdI52jKcYEKSYKpTRq8VfvqKe', 'CUSTOMER', 'ACTIVE', NOW(), NOW());

-- Create user profiles
INSERT INTO user_profiles (user_id, first_name, last_name, phone, created_at, updated_at) VALUES
('admin-001', 'System', 'Administrator', '+1234567890', NOW(), NOW()),
('user-001', 'John', 'Customer', '+1234567891', NOW(), NOW());