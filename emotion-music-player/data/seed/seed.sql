INSERT INTO users (email, password_hash, name)
VALUES
  ('demo1@example.com', '$2b$12$Q/A1Rrj9Wzh0M0YkVqE0vux2x2YyY6vKzA0mQw8xWm3mXvYzv7M8W', 'Demo User 1'),
  ('demo2@example.com', '$2b$12$Q/A1Rrj9Wzh0M0YkVqE0vux2x2YyY6vKzA0mQw8xWm3mXvYzv7M8W', 'Demo User 2')
ON CONFLICT (email) DO NOTHING;

TRUNCATE tracks RESTART IDENTITY CASCADE;

INSERT INTO tracks (
    title,
    artist,
    audio_url,
    duration,
    emotion,
    cover_image,
    emotion_scores
)
VALUES
(
    '50 Năm Về Sau',
    'Unknown Artist',
    '/media/50 Năm Về Sau.mp3',
    210,
    'calm',
    '/images/default-cover.png',
    '{}'
),
(
    'Turn Down For What',
    'Unknown Artist',
    '/media/Turn Down For What.mp3',
    210,
    'energetic',
    '/images/default-cover.png',
    '{}'
),
(
    'Yên Bình Có Quá Đắt Không',
    'Unknown Artist',
    '/media/Yên Bình Có Quá Đắt Không.mp3',
    210,
    'peaceful',
    '/images/default-cover.png',
    '{}'
);
