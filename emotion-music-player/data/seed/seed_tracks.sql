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