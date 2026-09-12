-- View for active users (example: users active in last 30 days)
CREATE OR REPLACE VIEW active_users AS
SELECT id, username, email, full_name, created_at
FROM users
WHERE is_active = TRUE AND created_at >= NOW() - INTERVAL '30 days';

-- View for upcoming activities (future activities)
CREATE OR REPLACE VIEW upcoming_activities AS
SELECT a.id, a.name, a.activity_type, a.start_time, a.end_time, a.location,
       u.username as creator_username
FROM activities a
JOIN users u ON a.created_by = u.id
WHERE a.start_time > NOW()
ORDER BY a.start_time ASC;

-- View for nearby activities
CREATE OR REPLACE VIEW nearby_activities AS
SELECT a.*, 
       u.username as creator_username,
       calculate_distance(ul.latitude, ul.longitude, a.latitude, a.longitude) as distance
FROM activities a
JOIN users u ON a.created_by = u.id
CROSS JOIN user_locations ul
WHERE a.start_time > NOW()
ORDER BY distance;

-- View for user progress summary
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    p.user_id,
    p.exercise_type,
    MAX(p.value) as max_value,
    AVG(p.value) as avg_value,
    COUNT(*) as total_entries
FROM progress p
GROUP BY p.user_id, p.exercise_type;

-- View for group activity summary
CREATE OR REPLACE VIEW group_activity_summary AS
SELECT 
    g.id as group_id,
    g.name as group_name,
    COUNT(DISTINCT gm.user_id) as member_count,
    COUNT(DISTINCT a.id) as activity_count
FROM groups g
LEFT JOIN group_members gm ON g.id = gm.group_id
LEFT JOIN activities a ON g.id = a.created_by
GROUP BY g.id, g.name;

-- View for user profile summary
CREATE OR REPLACE VIEW user_profile_summary AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.bio,
    u.profile_picture,
    (SELECT COUNT(*) FROM friends f WHERE (f.user_id = u.id OR f.friend_id = u.id) AND f.status = 'accepted') as friend_count,
    (SELECT COUNT(*) FROM group_members gm WHERE gm.user_id = u.id) as group_count,
    (SELECT COUNT(DISTINCT activity_type) FROM activities a 
     INNER JOIN activity_participants ap ON a.id = ap.activity_id 
     WHERE ap.user_id = u.id) as activity_types_count
FROM users u;

-- View for user's friends list
CREATE OR REPLACE VIEW user_friends AS
SELECT 
    u.id as user_id,
    CASE 
        WHEN f.user_id = u.id THEN f.friend_id 
        ELSE f.user_id 
    END as friend_id,
    fr.username as friend_username,
    fr.profile_picture as friend_profile_picture,
    f.status,
    f.created_at as friendship_date
FROM users u
JOIN friends f ON (f.user_id = u.id OR f.friend_id = u.id)
JOIN users fr ON (CASE WHEN f.user_id = u.id THEN f.friend_id ELSE f.user_id END = fr.id)
WHERE f.status = 'accepted';

-- View for user's groups
CREATE OR REPLACE VIEW user_groups AS
SELECT 
    gm.user_id,
    g.id as group_id,
    g.name as group_name,
    g.profile_picture as group_profile_picture,
    g.activity_type,
    gm.role as user_role,
    g.created_at as joined_date
FROM group_members gm
JOIN groups g ON gm.group_id = g.id;

-- View for user's activity history
CREATE OR REPLACE VIEW user_activity_history AS
SELECT 
    a.id as activity_id,
    a.name as activity_name,
    a.activity_type,
    a.created_at,
    a.start_time,
    a.end_time,
    a.duration_minutes,
    ap.user_id,
    ap.team,
    ap.score as team_score,
    json_agg(json_build_object(
        'username', u.username,
        'profile_picture', u.profile_picture,
        'team', ap2.team,
        'score', ap2.score
    )) as participants
FROM activities a
JOIN activity_participants ap ON a.id = ap.activity_id
JOIN activity_participants ap2 ON a.id = ap2.activity_id
JOIN users u ON ap2.user_id = u.id
GROUP BY a.id, a.name, a.activity_type, a.created_at, a.start_time, a.end_time, 
         a.duration_minutes, ap.user_id, ap.team, ap.score;


