INSERT INTO users (email, password_hash, name)
VALUES
  ('demo1@example.com', '$2b$12$Q/A1Rrj9Wzh0M0YkVqE0vux2x2YyY6vKzA0mQw8xWm3mXvYzv7M8W', 'Demo User 1'),
  ('demo2@example.com', '$2b$12$Q/A1Rrj9Wzh0M0YkVqE0vux2x2YyY6vKzA0mQw8xWm3mXvYzv7M8W', 'Demo User 2')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tracks (title, artist, audio_url, duration)
VALUES
  ('Happy Vibes', 'Artist A', 'https://example.com/audio/happy-vibes.mp3', 210000),
  ('Lo-fi Chill', 'Artist B', 'https://example.com/audio/lofi-chill.mp3', 180000),
  ('Deep Focus', 'Artist C', 'https://example.com/audio/deep-focus.mp3', 240000),
  ('Rainy Mood', 'Artist D', 'https://example.com/audio/rainy-mood.mp3', 200000),
  ('Night Drive', 'Artist E', 'https://example.com/audio/night-drive.mp3', 230000)
ON CONFLICT DO NOTHING;