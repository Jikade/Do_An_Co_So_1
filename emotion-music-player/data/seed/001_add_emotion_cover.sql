ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS file_path TEXT;

ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS emotion VARCHAR(20) DEFAULT 'relax';

ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS emotion_scores JSONB;

ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS cover_image TEXT;

CREATE TABLE IF NOT EXISTS emotions (
    code VARCHAR(20) PRIMARY KEY,
    label_vi VARCHAR(50) NOT NULL
);

INSERT INTO emotions (code, label_vi) VALUES
('happy', 'Vui vẻ'),
('sad', 'Buồn'),
('focus', 'Tập trung'),
('healing', 'Chữa lành'),
('relax', 'Thư giãn'),
('lonely', 'Cô đơn'),
('energetic', 'Năng động'),
('sleep', 'Dễ ngủ')
ON CONFLICT (code) DO NOTHING;