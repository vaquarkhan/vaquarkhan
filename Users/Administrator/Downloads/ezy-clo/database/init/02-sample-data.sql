-- Sample data for development and testing
-- This script inserts sample data for the Card Linked Benefits Platform

USE card_benefits_platform;

-- Insert sample customers
INSERT INTO customers (customer_id, encrypted_pan_token, segment_type, first_name, last_name, email, phone, date_of_birth, nationality, created_by) VALUES
(UUID(), 'TOKEN_123456789012', 'PREMIER', 'Ahmed', 'Al-Rashid', 'ahmed.rashid@email.com', '+966501234567', '1985-03-15', 'SAU', 'SYSTEM'),
(UUID(), 'TOKEN_234567890123', 'ADVANCE', 'Fatima', 'Al-Zahra', 'fatima.zahra@email.com', '+966502345678', '1990-07-22', 'SAU', 'SYSTEM'),
(UUID(), 'TOKEN_345678901234', 'MASS', 'Mohammed', 'Al-Otaibi', 'mohammed.otaibi@email.com', '+966503456789', '1988-11-10', 'SAU', 'SYSTEM'),
(UUID(), 'TOKEN_456789012345', 'TOP_TIER', 'Sarah', 'Al-Mansouri', 'sarah.mansouri@email.com', '+966504567890', '1982-05-18', 'SAU', 'SYSTEM'),
(UUID(), 'TOKEN_567890123456', 'PRIVATE', 'Khalid', 'Al-Faisal', 'khalid.faisal@email.com', '+966505678901', '1975-12-03', 'SAU', 'SYSTEM');

-- Insert sample cards
INSERT INTO cards (card_id, customer_id, card_type, bin_range, last_four_digits, expiry_date, is_primary) 
SELECT 
    UUID(),
    customer_id,
    CASE segment_type
        WHEN 'PRIVATE' THEN 'MASTERCARD_WORLD_ELITE'
        WHEN 'TOP_TIER' THEN 'MASTERCARD_WORLD'
        WHEN 'PREMIER' THEN 'MASTERCARD_PLATINUM'
        WHEN 'ADVANCE' THEN 'VISA_SIGNATURE'
        ELSE 'VISA_INFINITE'
    END,
    '52345678',
    LPAD(FLOOR(RAND() * 10000), 4, '0'),
    DATE_ADD(CURDATE(), INTERVAL 3 YEAR),
    TRUE
FROM customers;

-- Insert sample offers
INSERT INTO offers (offer_id, title, description, merchant_name, category, discount_type, discount_value, redemption_type, rules_config, eligibility_criteria, start_date, end_date, max_redemptions, created_by) VALUES
(UUID(), '20% Off Dining', 'Get 20% discount on all dining purchases', 'Premium Restaurants', 'DINING', 'PERCENTAGE', 20.00, 'BOTH', 
 '{"minSpend": 100, "maxDiscount": 200, "validDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]}',
 '{"segments": ["PREMIER", "TOP_TIER", "PRIVATE"], "cardTypes": ["MASTERCARD_WORLD_ELITE", "MASTERCARD_WORLD"]}',
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 1000, 'ADMIN'),

(UUID(), 'SAR 50 Cashback on Shopping', 'Earn SAR 50 cashback on shopping purchases above SAR 500', 'Major Shopping Malls', 'SHOPPING', 'FIXED_AMOUNT', 50.00, 'OFFLINE',
 '{"minSpend": 500, "merchantCodes": ["5311", "5411", "5651"]}',
 '{"segments": ["MASS", "ADVANCE", "PREMIER"], "spendThreshold": {"monthly": 2000}}',
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 MONTH), 500, 'ADMIN'),

(UUID(), '5% Cashback on Fuel', 'Get 5% cashback on all fuel purchases', 'ARAMCO Stations', 'FUEL', 'PERCENTAGE', 5.00, 'OFFLINE',
 '{"maxCashback": 100, "merchantCodes": ["5541"]}',
 '{"segments": ["MASS", "ADVANCE", "PREMIER", "TOP_TIER", "PRIVATE"]}',
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 2000, 'ADMIN'),

(UUID(), 'Free Airport Lounge Access', 'Complimentary airport lounge access worldwide', 'Priority Pass Lounges', 'TRAVEL', 'FIXED_AMOUNT', 0.00, 'ONLINE',
 '{"usageLimit": 6, "validAirports": ["RUH", "JED", "DXB", "DOH"]}',
 '{"segments": ["TOP_TIER", "PRIVATE"], "cardTypes": ["MASTERCARD_WORLD_ELITE", "MASTERCARD_WORLD"]}',
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 12 MONTH), 100, 'ADMIN'),

(UUID(), '15% Off Online Shopping', 'Get 15% discount on online purchases', 'E-commerce Partners', 'ONLINE_SHOPPING', 'PERCENTAGE', 15.00, 'ONLINE',
 '{"minSpend": 200, "maxDiscount": 300, "validWebsites": ["amazon.sa", "noon.com", "extra.com"]}',
 '{"segments": ["ADVANCE", "PREMIER"], "digitalWallet": true}',
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 MONTH), 750, 'ADMIN');

-- Update offers status to ACTIVE
UPDATE offers SET status = 'ACTIVE' WHERE created_by = 'ADMIN';

-- Insert sample spend thresholds
INSERT INTO spend_thresholds (threshold_id, customer_id, card_id, threshold_type, threshold_amount, current_spend, reset_date)
SELECT 
    UUID(),
    c.customer_id,
    ca.card_id,
    'MONTHLY',
    CASE c.segment_type
        WHEN 'PRIVATE' THEN 10000.00
        WHEN 'TOP_TIER' THEN 7500.00
        WHEN 'PREMIER' THEN 5000.00
        WHEN 'ADVANCE' THEN 3000.00
        ELSE 1500.00
    END,
    FLOOR(RAND() * 2000) + 500,
    LAST_DAY(CURDATE())
FROM customers c
JOIN cards ca ON c.customer_id = ca.customer_id;

-- Insert sample transactions
INSERT INTO transactions (transaction_id, customer_id, card_id, transaction_type, amount, merchant_category_code, merchant_name, transaction_date, points_earned)
SELECT 
    UUID(),
    c.customer_id,
    ca.card_id,
    'PURCHASE',
    FLOOR(RAND() * 500) + 50,
    CASE FLOOR(RAND() * 5)
        WHEN 0 THEN '5411' -- Grocery
        WHEN 1 THEN '5812' -- Restaurants
        WHEN 2 THEN '5541' -- Fuel
        WHEN 3 THEN '5311' -- Department Stores
        ELSE '4511' -- Airlines
    END,
    CASE FLOOR(RAND() * 5)
        WHEN 0 THEN 'Panda Supermarket'
        WHEN 1 THEN 'Al Baik Restaurant'
        WHEN 2 THEN 'ARAMCO Station'
        WHEN 3 THEN 'Centrepoint Store'
        ELSE 'Saudia Airlines'
    END,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 30) DAY),
    FLOOR(RAND() * 50) + 10
FROM customers c
JOIN cards ca ON c.customer_id = ca.customer_id
CROSS JOIN (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) AS numbers;

-- Insert sample bank partners
INSERT INTO bank_partners (partner_id, bank_name, bank_code, api_endpoint, api_credentials, sso_config, status, created_by) VALUES
(UUID(), 'Saudi National Bank', 'SNB', 'https://api.snb.com/v1', 
 '{"clientId": "snb_client_123", "clientSecret": "encrypted_secret", "apiKey": "snb_api_key"}',
 '{"type": "SAML", "entityId": "snb.com", "ssoUrl": "https://sso.snb.com/saml", "certificate": "cert_data"}',
 'ACTIVE', 'SYSTEM'),

(UUID(), 'Al Rajhi Bank', 'ARB', 'https://api.alrajhibank.com.sa/v1',
 '{"clientId": "arb_client_456", "clientSecret": "encrypted_secret", "apiKey": "arb_api_key"}',
 '{"type": "OAuth2", "clientId": "arb_oauth_client", "authUrl": "https://auth.alrajhibank.com.sa/oauth2", "tokenUrl": "https://auth.alrajhibank.com.sa/token"}',
 'ACTIVE', 'SYSTEM'),

(UUID(), 'Riyad Bank', 'RB', 'https://api.riyadbank.com/v1',
 '{"clientId": "rb_client_789", "clientSecret": "encrypted_secret", "apiKey": "rb_api_key"}',
 '{"type": "OpenID", "clientId": "rb_oidc_client", "discoveryUrl": "https://auth.riyadbank.com/.well-known/openid_configuration"}',
 'TESTING', 'SYSTEM');

-- Insert sample audit trail entries
INSERT INTO audit_trail (audit_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, session_id)
SELECT 
    UUID(),
    'SYSTEM',
    'CREATE',
    'CUSTOMER',
    customer_id,
    NULL,
    JSON_OBJECT('segment_type', segment_type, 'status', status),
    '127.0.0.1',
    'System/1.0',
    'INIT_SESSION'
FROM customers;

-- Insert sample approval workflow entries
INSERT INTO approval_workflow (workflow_id, entity_type, entity_id, action_type, maker_id, status, maker_comments)
SELECT 
    UUID(),
    'OFFER',
    offer_id,
    'CREATE',
    'ADMIN',
    'APPROVED',
    'Initial offer creation during system setup'
FROM offers;

COMMIT;