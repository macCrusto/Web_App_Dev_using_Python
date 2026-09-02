CREATE DATABASE platform;
USE platform;

CREATE TABLE Users (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_no VARCHAR(20),
    password VARCHAR(200) NOT NULL,
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_password_change TIMESTAMP NULL
);
 
--  INSERT INTO Users (fullname, email, password, role, is_verified)
--  VALUE('Admin', 'admin@academy.com', '$2b$12$HOC1Z7igAkaYf9QAqBSRU.yp8cEEaKNhvAT.bhWXMALawg.vEYpii', 'ADMIN', TRUE);
 
CREATE TABLE OAuthAccount (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_provider_account (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE course (
	id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(20) NOT NULL,
    description VARCHAR(500) NULL,
    thumbnail_url TEXT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
    free_count INT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_course_instructor(instructor_id),
    
    CONSTRAINT fk_course_instructor 
    FOREIGN KEY (instructor_id) REFERENCES Users(id) ON DELETE RESTRICT 
);

CREATE TABLE module (
	id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    module_position INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_module_course(course_id),
    INDEX idx_module_position(module_position, course_id),

    CONSTRAINT fk_module_course
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE 
);
    
CREATE TABLE lessons (
	id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content_type ENUM('VIDEO', 'DOCUMENT', 'PDF', 'LINK', 'CODE') NOT NULL,
    content_body LONGTEXT NULL,
    content_url TEXT NULL,
    lesson_position INT UNSIGNED NOT NULL,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    duration_seconds INT UNSIGNED NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_lesson_module(module_id),
    INDEX idx_lesson_position(lesson_position, module_id),
    
    CONSTRAINT fk_lesson_module
    FOREIGN KEY (module_id) REFERENCES module(id)
);
    
CREATE TABLE enrollment (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id INT NOT NULL,
    access_type ENUM('PREVIEW', 'FULL') NOT NULL DEFAULT 'PREVIEW',
    status ENUM('ACTIVE', 'EXPIRED', 'CANCELED') NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
    UNIQUE KEY unique_student_course (user_id, course_id),
    
    INDEX idx_enrollment_user(user_id),
    INDEX idx_enrollment_course(course_id),
    
    CONSTRAINT fk_user_enrollment
    FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT fk_course_enrollment
    FOREIGN KEY (course_id) REFERENCES course(id)
);

CREATE TABLE payments (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id INT NOT NULL,
    reference VARCHAR(100) NOT NULL,
    provider ENUM('PAYSTACK', 'FLUTTERWAVE') DEFAULT 'PAYSTACK',
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
    status ENUM('PAID', 'PENDING', 'FAILED', 'REFUNDED', 'ABANDONED') NOT NULL DEFAULT 'PENDING',
    paid_at DATETIME NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_payment_reference (reference),
    
	INDEX idx_payment_student(user_id),
    INDEX idx_payment_course(course_id),
	INDEX idx_payment_status(status),
     
	CONSTRAINT fk_user_module
    FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT fk_course
    FOREIGN KEY (course_id) REFERENCES course(id)
);