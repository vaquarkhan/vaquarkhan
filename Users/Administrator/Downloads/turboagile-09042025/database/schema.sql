-- TurboAgile Database Schema
-- DDL Script for creating tables

-- Projects table
CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stories table
CREATE TABLE stories (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'blocked',
    blocked_by TEXT,
    order_number INT NOT NULL,
    requirements TEXT,
    architecture TEXT,
    framework TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Architecture documents table
CREATE TABLE architectures (
    id VARCHAR(50) PRIMARY KEY,
    story_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    diagram_code TEXT,
    custom_prompt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id)
);

-- Generated code table
CREATE TABLE generated_code (
    id VARCHAR(50) PRIMARY KEY,
    story_id VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    code_content TEXT NOT NULL,
    language VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id)
);

-- Configuration table
CREATE TABLE configurations (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);