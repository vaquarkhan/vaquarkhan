-- Sample data for TurboAgile

-- Insert sample project
INSERT INTO projects (id, name, description, requirements) VALUES 
('proj-sample-001', 'E-commerce Platform', 'Complete e-commerce solution with user management', 'Build a modern e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and admin dashboard');

-- Insert sample stories
INSERT INTO stories (id, project_id, title, description, type, status, order_number, requirements) VALUES 
('story-arch-001', 'proj-sample-001', '🏗️ Define System Architecture', 'Create comprehensive system architecture including technology stack, component design, and infrastructure planning.', 'architecture', 'ready', 1, 'E-commerce platform architecture'),
('story-framework-001', 'proj-sample-001', '⚙️ Setup Development Framework', 'Initialize project structure, configure build tools, setup development environment and core dependencies.', 'framework', 'blocked', 2, NULL),
('story-feature-001', 'proj-sample-001', '👤 User Registration System', 'Implement user registration with email verification, password validation, and account activation.', 'feature', 'blocked', 3, NULL),
('story-feature-002', 'proj-sample-001', '🔐 User Login & Authentication', 'Create secure login system with JWT tokens, remember me, and session management.', 'feature', 'blocked', 4, NULL),
('story-feature-003', 'proj-sample-001', '🛒 Product Catalog System', 'Build product listing, categories, search, and product detail pages.', 'feature', 'blocked', 5, NULL),
('story-feature-004', 'proj-sample-001', '🛍️ Shopping Cart & Checkout', 'Implement shopping cart functionality with checkout process and order management.', 'feature', 'blocked', 6, NULL),
('story-feature-005', 'proj-sample-001', '💳 Payment Processing', 'Integrate payment gateway for secure payment processing and transaction management.', 'feature', 'blocked', 7, NULL),
('story-feature-006', 'proj-sample-001', '📊 Admin Dashboard', 'Create admin panel for managing products, orders, users, and analytics.', 'feature', 'blocked', 8, NULL);

-- Insert sample configuration
INSERT INTO configurations (config_key, config_value) VALUES 
('app_version', '1.0.0'),
('default_theme', 'dark'),
('max_stories_per_project', '50');