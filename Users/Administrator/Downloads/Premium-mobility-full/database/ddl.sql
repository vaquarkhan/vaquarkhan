-- Schema definition for Premium Mobility demo

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(100),
    preferred_language VARCHAR(10),
    home_airport VARCHAR(10),
    loyalty_tier VARCHAR(50),
    points_balance INT
);

CREATE TABLE IF NOT EXISTS chauffeurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    tagline VARCHAR(255),
    phone_number VARCHAR(100),
    email VARCHAR(255),
    vehicle_type VARCHAR(255),
    rating DOUBLE,
    languages VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255),
    description VARCHAR(2000),
    category VARCHAR(255),
    base_price DECIMAL(12,2),
    currency VARCHAR(10),
    service_level_agreement VARCHAR(255),
    premium_only BOOLEAN
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_type VARCHAR(255),
    details VARCHAR(2000),
    date VARCHAR(255),
    status VARCHAR(100),
    origin_address VARCHAR(255),
    destination_address VARCHAR(255),
    pickup_time VARCHAR(255),
    dropoff_time VARCHAR(255),
    passenger_count INT,
    special_requests VARCHAR(2000),
    payment_status VARCHAR(100),
    total_amount DECIMAL(12,2),
    currency VARCHAR(10),
    customer_id BIGINT,
    service_id BIGINT,
    chauffeur_id BIGINT,
    CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_bookings_service FOREIGN KEY (service_id) REFERENCES services (id),
    CONSTRAINT fk_bookings_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs (id)
);

CREATE TABLE IF NOT EXISTS concierge_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    service_id BIGINT,
    request_type VARCHAR(255),
    priority VARCHAR(50),
    status VARCHAR(100),
    requested_on DATETIME,
    due_on DATETIME,
    assigned_to VARCHAR(255),
    notes VARCHAR(4000),
    CONSTRAINT fk_concierge_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_concierge_service FOREIGN KEY (service_id) REFERENCES services (id)
);

CREATE TABLE IF NOT EXISTS insurance_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255),
    coverage_summary VARCHAR(2000),
    region VARCHAR(255),
    base_premium DECIMAL(12,2),
    currency VARCHAR(10),
    terms_url VARCHAR(1024),
    max_trip_length_days INT
);

CREATE TABLE IF NOT EXISTS insurance_quotes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    customer_id BIGINT,
    booking_id BIGINT,
    quote_reference VARCHAR(255),
    premium_amount DECIMAL(12,2),
    currency VARCHAR(10),
    coverage_start DATE,
    coverage_end DATE,
    status VARCHAR(100),
    CONSTRAINT fk_quotes_product FOREIGN KEY (product_id) REFERENCES insurance_products (id),
    CONSTRAINT fk_quotes_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_quotes_booking FOREIGN KEY (booking_id) REFERENCES bookings (id)
);

CREATE TABLE IF NOT EXISTS esim_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255),
    region VARCHAR(255),
    data_allowance_gb DECIMAL(10,2),
    validity_days INT,
    price DECIMAL(12,2),
    currency VARCHAR(10),
    partner VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS esim_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    package_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    booking_id BIGINT,
    order_number VARCHAR(255) UNIQUE,
    status VARCHAR(100),
    activation_code VARCHAR(255),
    ordered_on DATETIME,
    activated_on DATETIME,
    CONSTRAINT fk_esim_order_package FOREIGN KEY (package_id) REFERENCES esim_packages (id),
    CONSTRAINT fk_esim_order_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_esim_order_booking FOREIGN KEY (booking_id) REFERENCES bookings (id)
);

CREATE TABLE IF NOT EXISTS partner_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    partner_name VARCHAR(255),
    description VARCHAR(2000),
    region VARCHAR(255),
    benefit_summary VARCHAR(1000),
    loyalty_tier_required VARCHAR(50),
    terms_url VARCHAR(1024),
    valid_from DATE,
    valid_to DATE
);

CREATE TABLE IF NOT EXISTS experience_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    service_id BIGINT,
    experience_type VARCHAR(100),
    title VARCHAR(255),
    description VARCHAR(2000),
    status VARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    departure_location VARCHAR(255),
    arrival_location VARCHAR(255),
    guests INT,
    operator_name VARCHAR(255),
    asset_details VARCHAR(1000),
    total_amount DECIMAL(12,2),
    currency VARCHAR(10),
    CONSTRAINT fk_experience_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_experience_service FOREIGN KEY (service_id) REFERENCES services (id)
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    transaction_type VARCHAR(100),
    points_change INT,
    balance_after INT,
    description VARCHAR(1000),
    transaction_date DATETIME,
    CONSTRAINT fk_loyalty_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
);

CREATE TABLE IF NOT EXISTS feedback_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    booking_id BIGINT,
    experience_id BIGINT,
    rating INT,
    sentiment_score DECIMAL(4,2),
    channel VARCHAR(100),
    comments VARCHAR(2000),
    submitted_at DATETIME,
    CONSTRAINT fk_feedback_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_feedback_booking FOREIGN KEY (booking_id) REFERENCES bookings (id),
    CONSTRAINT fk_feedback_experience FOREIGN KEY (experience_id) REFERENCES experience_bookings (id)
);

CREATE TABLE IF NOT EXISTS secure_chat_threads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    subject VARCHAR(255),
    status VARCHAR(100),
    created_at DATETIME,
    last_message_at DATETIME,
    CONSTRAINT fk_chat_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
);

CREATE TABLE IF NOT EXISTS secure_chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    thread_id BIGINT NOT NULL,
    sender_type VARCHAR(50),
    sender_name VARCHAR(255),
    message VARCHAR(4000),
    sent_at DATETIME,
    read_at DATETIME,
    attachment_url VARCHAR(1024),
    CONSTRAINT fk_chat_message_thread FOREIGN KEY (thread_id) REFERENCES secure_chat_threads (id)
);

CREATE TABLE IF NOT EXISTS translator_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    source_language VARCHAR(10),
    target_language VARCHAR(10),
    transcript TEXT,
    created_at DATETIME,
    CONSTRAINT fk_translator_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
);

CREATE TABLE IF NOT EXISTS biometric_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    preference_type VARCHAR(100),
    enabled BOOLEAN,
    metadata JSON,
    updated_at DATETIME,
    CONSTRAINT fk_biometric_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
);

CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    snapshot_time DATETIME,
    metric_key VARCHAR(150),
    metric_value DECIMAL(18,4),
    dimension VARCHAR(150),
    notes VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS ai_interactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    channel VARCHAR(100),
    endpoint VARCHAR(150),
    prompt_excerpt VARCHAR(1000),
    response_excerpt VARCHAR(1000),
    tokens_used INT,
    latency_ms INT,
    success BOOLEAN,
    created_at DATETIME,
    CONSTRAINT fk_ai_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
);

