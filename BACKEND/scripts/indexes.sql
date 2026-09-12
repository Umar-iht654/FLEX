-- Users: Quick lookup by email and username
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Activities: Search by created_by and start_time
CREATE INDEX idx_activities_created_by ON activities(created_by);
CREATE INDEX idx_activities_start_time ON activities(start_time);

-- Groups: Search by created_by and activity_type
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_groups_activity_type ON groups(activity_type);

-- Messages: Search by sender, recipient, and group
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_group_id ON messages(group_id);

-- Group Members: Search by user and group
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);

-- Activity Participants: Search by activity and user
CREATE INDEX idx_activity_participants_activity_id ON activity_participants(activity_id);
CREATE INDEX idx_activity_participants_user_id ON activity_participants(user_id);

-- Geo-spatial index for user locations
CREATE INDEX idx_user_locations_coords ON user_locations(latitude, longitude);

-- Progress: Search by user and exercise type
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_exercise_type ON progress(exercise_type);

-- Goals: Search by user and deadline
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_deadline ON goals(deadline);

-- Recommendations: Search by user and activity type
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_activity_type ON recommendations(activity_type);

-- User Interests: Search by user
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);

-- Friends: Search by user relationships
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_friend_id ON friends(friend_id);
CREATE INDEX idx_friends_status ON friends(status);

-- Activities: Additional indexes for duration and teams
CREATE INDEX idx_activities_duration ON activities(duration_minutes);
CREATE INDEX idx_activity_participants_team ON activity_participants(team);
CREATE INDEX idx_activity_participants_score ON activity_participants(score);
