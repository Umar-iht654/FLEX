-- Function to auto-update 'updated_at' timestamp on row change
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between coordinates
CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float)
RETURNS float AS $$
DECLARE
    R float := 6371; -- Earth's radius in kilometers
    dLat float;
    dLon float;
    a float;
    c float;
BEGIN
    -- Convert to radians
    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);
    
    -- Haversine formula
    a := sin(dLat/2) * sin(dLat/2) +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dLon/2) * sin(dLon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a user can join an activity
CREATE OR REPLACE FUNCTION can_join_activity(user_id integer, activity_id integer)
RETURNS boolean AS $$
DECLARE
    max_participants integer;
    current_participants integer;
BEGIN
    SELECT max_participants INTO max_participants
    FROM activities
    WHERE id = activity_id;
    
    SELECT COUNT(*) INTO current_participants
    FROM activity_participants
    WHERE activity_id = activity_id;
    
    RETURN current_participants < max_participants;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user's progress percentage towards a goal
CREATE OR REPLACE FUNCTION calculate_goal_progress(goal_id integer)
RETURNS float AS $$
DECLARE
    target_value float;
    current_value float;
BEGIN
    SELECT target_value, current_value INTO target_value, current_value
    FROM goals
    WHERE id = goal_id;
    
    RETURN (current_value / target_value) * 100;
END;
$$ LANGUAGE plpgsql;
