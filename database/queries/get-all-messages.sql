-- Get all messages with sender and recipient details
SELECT
  m.id,
  m.subject,
  m.body,
  m.is_read,
  m.created_at,
  sender.username AS sender_username,
  sender.email AS sender_email,
  recipient.username AS recipient_username,
  recipient.email AS recipient_email
FROM messages m
JOIN users sender ON m.sender_id = sender.id
JOIN users recipient ON m.recipient_id = recipient.id
ORDER BY m.created_at DESC;
