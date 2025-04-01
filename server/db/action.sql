SELECT r.first_name, r.last_name, r.email, 
e.name AS event_name
FROM reservations r
JOIN events e ON e.id = r.event_id