-- Get all unread messages
SELECT
  m.id,
  m.subject,
  m.body,
  m.created_at,
  sender.username AS sender,
  recipient.username AS recipient
FROM messages m
JOIN users sender ON m.sender_id = sender.id
JOIN users recipient ON m.recipient_id = recipient.id
WHERE m.is_read = FALSE
ORDER BY m.created_at DESC;
