-- Card Linked Benefits Platform Database Initialization
-- This script creates the initial database schema for the banking application

USE card_benefits_platform;

-- Enable strict mode for better data integrity
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- Create customers table with golden records methodology
CREATE TABLE customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    encrypted_pan_token VARCHAR(255) NOT NULL UNIQUE,
    segment_type ENUM('MASS', 'ADVANCE', 'PREMIER', 'TOP_TIER', 'PRIVATE') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(3),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_segment_type (segment_type),
    INDEX idx_status (status),
    INDEX idx_created_date (created_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create cards table for customer card information
CREATE TABLE cards (
    card_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    card_type ENUM('MASTERCARD_WORLD_ELITE', 'MASTERCARD_WORLD', 'MASTERCARD_PLATINUM', 'VISA_SIGNATURE', 'VISA_INFINITE') NOT NULL,
    bin_range VARCHAR(8) NOT NULL,
    last_four_digits VARCHAR(4) NOT NULL,
    expiry_date DATE NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE', 'BLOCKED', 'EXPIRED') DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_card_type (card_type),
    INDEX idx_bin_range (bin_range),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create offers table for offer management
CREATE TABLE offers (
    offer_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    merchant_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'CASHBACK') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    redemption_type ENUM('ONLINE', 'OFFLINE', 'BOTH') NOT NULL,
    rules_config JSON,
    eligibility_criteria JSON,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    max_redemptions INT DEFAULT NULL,
    current_redemptions INT DEFAULT 0,
    status ENUM('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'EXPIRED', 'ARCHIVED') DEFAULT 'DRAFT',
    image_url VARCHAR(500),
    terms_conditions TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_start_end_date (start_date, end_date),
    INDEX idx_merchant_name (merchant_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create transactions table for financial ledger
CREATE TABLE transactions (
    transaction_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    card_id VARCHAR(36) NOT NULL,
    offer_id VARCHAR(36),
    transaction_type ENUM('PURCHASE', 'REDEMPTION', 'REFUND', 'ADJUSTMENT') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    merchant_category_code VARCHAR(4),
    merchant_name VARCHAR(255),
    transaction_date TIMESTAMP NOT NULL,
    points_earned DECIMAL(10,2) DEFAULT 0,
    redemption_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT NULL,
    external_transaction_id VARCHAR(255),
    audit_trail JSON,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (card_id) REFERENCES cards(card_id),
    FOREIGN KEY (offer_id) REFERENCES offers(offer_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_card_id (card_id),
    INDEX idx_offer_id (offer_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_merchant_category_code (merchant_category_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create approval workflow table for maker-checker-approver
CREATE TABLE approval_workflow (
    workflow_id VARCHAR(36) PRIMARY KEY,
    entity_type ENUM('OFFER', 'BANK_PARTNER', 'SSO_CONFIG', 'RULE') NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    action_type ENUM('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE') NOT NULL,
    maker_id VARCHAR(100) NOT NULL,
    checker_id VARCHAR(100),
    approver_id VARCHAR(100),
    status ENUM('PENDING_CHECKER', 'PENDING_APPROVER', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_CHECKER',
    maker_comments TEXT,
    checker_comments TEXT,
    approver_comments TEXT,
    rejection_reason TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checker_date TIMESTAMP NULL,
    approver_date TIMESTAMP NULL,
    INDEX idx_entity_type_id (entity_type, entity_id),
    INDEX idx_status (status),
    INDEX idx_maker_id (maker_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit trail table for compliance
CREATE TABLE audit_trail (
    audit_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_entity_type_id (entity_type, entity_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create spend thresholds table
CREATE TABLE spend_thresholds (
    threshold_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    card_id VARCHAR(36),
    threshold_type ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NOT NULL,
    threshold_amount DECIMAL(15,2) NOT NULL,
    current_spend DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'SAR',
    reset_date DATE NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'EXPIRED') DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (card_id) REFERENCES cards(card_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_card_id (card_id),
    INDEX idx_threshold_type (threshold_type),
    INDEX idx_reset_date (reset_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create bank partners configuration table
CREATE TABLE bank_partners (
    partner_id VARCHAR(36) PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL,
    bank_code VARCHAR(10) NOT NULL UNIQUE,
    api_endpoint VARCHAR(500),
    api_credentials JSON,
    sso_config JSON,
    status ENUM('ACTIVE', 'INACTIVE', 'TESTING') DEFAULT 'TESTING',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_bank_code (bank_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create system configuration table
CREATE TABLE system_config (
    config_id VARCHAR(36) PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSON NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial system configurations
INSERT INTO system_config (config_id, config_key, config_value, description) VALUES
(UUID(), 'jwt.expiration', '{"hours": 24}', 'JWT token expiration time'),
(UUID(), 'encryption.algorithm', '{"algorithm": "AES/GCM/NoPadding", "keyLength": 256}', 'Encryption settings'),
(UUID(), 'audit.retention', '{"days": 2555}', 'Audit trail retention period (7 years)'),
(UUID(), 'api.rate.limit', '{"requests": 1000, "window": "1h"}', 'API rate limiting configuration'),
(UUID(), 'notification.channels', '{"email": true, "sms": true, "push": false}', 'Enabled notification channels');

-- Create indexes for performance optimization
CREATE INDEX idx_customers_segment_status ON customers(segment_type, status);
CREATE INDEX idx_offers_category_status ON offers(category, status);
CREATE INDEX idx_transactions_date_type ON transactions(transaction_date, transaction_type);
CREATE INDEX idx_audit_trail_timestamp_user ON audit_trail(timestamp, user_id);

-- Create a view for customer spend summary
CREATE VIEW customer_spend_summary AS
SELECT 
    c.customer_id,
    c.segment_type,
    COUNT(DISTINCT ca.card_id) as total_cards,
    COALESCE(SUM(t.amount), 0) as total_spend,
    COALESCE(SUM(t.points_earned), 0) as total_points,
    COUNT(DISTINCT t.offer_id) as offers_redeemed,
    MAX(t.transaction_date) as last_transaction_date
FROM customers c
LEFT JOIN cards ca ON c.customer_id = ca.customer_id
LEFT JOIN transactions t ON ca.card_id = t.card_id AND t.transaction_type = 'PURCHASE'
WHERE c.status = 'ACTIVE'
GROUP BY c.customer_id, c.segment_type;

-- Create a view for offer performance analytics
CREATE VIEW offer_performance AS
SELECT 
    o.offer_id,
    o.title,
    o.merchant_name,
    o.category,
    o.status,
    COUNT(t.transaction_id) as total_redemptions,
    COALESCE(SUM(t.amount), 0) as total_redemption_value,
    COUNT(DISTINCT t.customer_id) as unique_customers,
    o.max_redemptions,
    (COUNT(t.transaction_id) / NULLIF(o.max_redemptions, 0)) * 100 as redemption_rate
FROM offers o
LEFT JOIN transactions t ON o.offer_id = t.offer_id AND t.transaction_type = 'REDEMPTION'
GROUP BY o.offer_id, o.title, o.merchant_name, o.category, o.status, o.max_redemptions;

COMMIT;