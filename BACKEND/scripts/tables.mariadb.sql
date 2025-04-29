-- USERS table
CREATE TABLE users (
    id INT AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    hashed_password TEXT NOT NULL,
    profile_picture TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (email),
    UNIQUE KEY (username)
);

-- ACTIVITIES table
CREATE TABLE activities (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(255),
    location VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_minutes INT,
    max_participants INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ACTIVITY PARTICIPANTS table
CREATE TABLE activity_participants (
    activity_id INT,
    user_id INT,
    team VARCHAR(255),
    score FLOAT,
    PRIMARY KEY (activity_id, user_id),
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SCORE RECORDS table
CREATE TABLE score_record (
    id INT AUTO_INCREMENT,
    activity_id INT,
    user_id INT,
    team VARCHAR(255),
    score DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- GROUPS table
CREATE TABLE `groups` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio VARCHAR (255),
    activity_type VARCHAR(255),
    member_count INT DEFAULT 0,
    PRIMARY KEY (id)
);

-- GROUP MEMBERS table
CREATE TABLE group_members (
    group_id INT PRIMARY KEY,
    user_username INT,
    role VARCHAR(50) DEFAULT 'member',
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE
);

-- MESSAGES table
CREATE TABLE messages (
    id INT AUTO_INCREMENT,
    content TEXT NOT NULL,
    sender_id INT NOT NULL,
    group_id INT,
    recipient_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_message_type CHECK (
        (group_id IS NULL AND recipient_id IS NOT NULL) OR
        (group_id IS NOT NULL AND recipient_id IS NULL)
    )
);
-- PROGRESS table
CREATE TABLE progress (
    id INT AUTO_INCREMENT,
    user_id INT,
    exercise_type VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- GOALS table
CREATE TABLE goals (
    id INT AUTO_INCREMENT,
    user_id INT,
    exercise_type VARCHAR(255) NOT NULL,
    target_value FLOAT NOT NULL,
    deadline TIMESTAMP NOT NULL,
    current_value FLOAT DEFAULT 0,
    is_completed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- USER LOCATIONS table
CREATE TABLE user_locations (
    id INT AUTO_INCREMENT,
    user_id INT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- RECOMMENDATIONS table
CREATE TABLE recommendations (
    id INT AUTO_INCREMENT,
    user_id INT,
    recommendation_type VARCHAR(50) NOT NULL, -- 'mutual_friend', 'nearby_user', 'local_activity', 'possible_interest'
    item_id INT NOT NULL, -- user_id or activity_id depending on type
    activity_type VARCHAR(255), -- only for 'local_activity' and 'possible_interest' types
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_viewed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
--Mutual friends: Type = 'mutual_friend', item_id = user_id of the recommended friend
--Nearby users: Type = 'nearby_user', item_id = user_id of the nearby person
--Local activities: Type = 'local_activity', item_id = activity_id, with activity_type specified
--Possible interests: Type = 'possible_interest', item_id can reference an example activity, with activity_type specified

-- USER INTERESTS table
CREATE TABLE user_interests (
    user_id INT,
    interest VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, interest),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- FRIENDS table
CREATE TABLE friends (
    user_id INT,
    friend_id INT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add CHECK constraint for FRIENDS table status (MariaDB 10.2.1 and above)
ALTER TABLE friends
ADD CONSTRAINT chk_status CHECK (status IN ('pending', 'accepted', 'rejected')); 