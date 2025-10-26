-- Sample seed data for SnailMail

-- Insert sample users
INSERT INTO users (username, email, password_hash) VALUES
('alice', 'alice@example.com', '$2a$10$dummyhash1'),
('bob', 'bob@example.com', '$2a$10$dummyhash2'),
('charlie', 'charlie@example.com', '$2a$10$dummyhash3');

-- Insert sample messages
INSERT INTO messages (sender_id, recipient_id, subject, body, is_read) VALUES
(1, 2, 'Hello Bob!', 'Hey Bob, how are you doing?', FALSE),
(2, 1, 'Re: Hello Bob!', 'Hi Alice! I am doing great, thanks for asking!', TRUE),
(1, 3, 'Meeting Tomorrow', 'Don''t forget about our meeting tomorrow at 3 PM.', FALSE),
(3, 1, 'Re: Meeting Tomorrow', 'Thanks for the reminder! I''ll be there.', FALSE),
(2, 3, 'Quick Question', 'Do you have a moment to discuss the project?', FALSE);

-- Note: Attachments table is empty by default
-- Add sample attachments if needed:
-- INSERT INTO attachments (message_id, filename, file_url, file_size, mime_type) VALUES
-- (1, 'document.pdf', 'https://example.com/files/document.pdf', 1024000, 'application/pdf');
