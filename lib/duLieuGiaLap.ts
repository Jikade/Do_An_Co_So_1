// Du lieu gia lap cho giao dien MoodSync AI

export type SongTheme =
  | "pink"
  | "red"
  | "blue"
  | "green"
  | "violet"
  | "sepia"
  | "cyan";
export type Emotion =
  | "happy"
  | "sad"
  | "calm"
  | "angry"
  | "romantic"
  | "nostalgic"
  | "energetic"
  | "stressed";
export type Language = "vi" | "en";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  theme: SongTheme;
  coverUrl: string;
  audioUrl: string;
  emotion: Emotion;
  mood: Emotion;
  palette: { primary: string; secondary: string };
  lyricsVi: string[];
  lyricsEn: string[];
  relatedSongIds: string[];
}

export interface Playlist {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  coverUrl: string;
  songCount: number;
  duration: string;
  theme: SongTheme;
  emotion: Emotion;
  mood: Emotion;
  songs: Song[];
}

export interface EmotionData {
  emotion: Emotion;
  confidence: number;
  source: "face" | "voice" | "text" | "fusion";
  timestamp: Date;
}

export interface ListeningHistory {
  id: string;
  song: Song;
  emotion: Emotion;
  source: "face" | "voice" | "text" | "fusion";
  timestamp: Date;
  duration: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  tier: "free" | "plus" | "vip";
  preferredLanguage: Language;
}

export const translations = {
  vi: {
    home: "Trang chủ",
    dashboard: "Bảng điều khiển",
    nowPlaying: "Đang phát",
    discover: "Khám phá",
    library: "Thu vien",
    recommendations: "Đề xuất",
    history: "Lịch sử",
    analytics: "Phân tích",
    settings: "Cài đặt",
    emotionDetection: "Phát hiện cảm xúc",
    search: "Tìm kiếm",
    notifications: "Thông báo",
    profile: "Hồ sơ",
    language: "Ngôn ngữ",
    logout: "Đăng xuất",
    happy: "Vui vẻ",
    sad: "Buồn",
    calm: "Bình yên",
    angry: "Tức giận",
    romantic: "Lãng mạn",
    nostalgic: "Hoài niệm",
    energetic: "Năng động",
    stressed: "Căng thẳng",
    welcome: "Xin chào",
    currentMood: "Tâm trạng hiện tại",
    fusionScore: "Điểm tổng hợp",
    nowPlayingLabel: "Đang phát",
    recommendationCount: "Đề xuất cho bạn",
    recentlyPlayed: "Nghe gần đây",
    continueListening: "Tiếp tục nghe",
    forYou: "Dành cho bạn",
    moodTrend: "Xu hướng tâm trạng",
    faceDetection: "Nhận diện khuôn mặt",
    voiceAnalysis: "Phân tích giọng nói",
    textMood: "Phân tích văn bản",
    multimodal: "Đa phương thức",
    startAnalysis: "Bắt đầu phân tích",
    analyzing: "Đang phân tích...",
    confidence: "Độ tin cậy",
    finalResult: "Kết quả tổng hợp",
    inputPlaceholder: "Nhập cảm xúc của bạn...",
    lyrics: "Lời bài hát",
    queue: "Danh sách chờ",
    outputDevice: "Thiết bị phát",
    relatedTracks: "Bài hát liên quan",
    addToFavorite: "Thêm yêu thích",
    share: "Chia sẻ",
    basedOnMood: "Theo tâm trạng",
    trending: "Xu hướng",
    focus: "Tập trung",
    sleep: "Ngủ ngon",
    workout: "Tập luyện",
    healing: "Hồi phục",
    matchesMood: "Phù hợp với tâm trạng hiện tại",
    detectedSad: "Đề xuất sau khi phát hiện buồn",
    boostEnergy: "Tăng năng lượng",
    reduceStress: "Giảm căng thẳng",
    listeningHistory: "Lịch sử nghe",
    weeklyStats: "Thống kê tuần",
    mostPlayed: "Nghe nhiều nhất",
    topGenre: "Thể loại yêu thích",
    totalTime: "Tổng thời gian",
    moodAnalytics: "Phân tích tâm trạng",
    listeningDuration: "Thời lượng nghe",
    emotionDistribution: "Phân bố cảm xúc",
    favoriteGenres: "Thể loại yêu thích",
    peakListening: "Giờ nghe cao điểm",
    weekly: "Tuần",
    monthly: "Tháng",
    profileSettings: "Cài đặt hồ sơ",
    themeSettings: "Giao diện",
    musicPreferences: "Sở thích âm nhạc",
    inputMode: "Chế độ nhập",
    notificationSettings: "Thông báo",
    privacySettings: "Quyền riêng tư",
    connectedServices: "Dịch vụ kết nối",
    saveChanges: "Lưu thay đổi",
    free: "Miễn phí",
    plus: "Plus",
    vipPro: "VIP Pro",
    upgrade: "Nâng cấp",
    currentPlan: "Gói hiện tại",
    tagline: "Âm nhạc theo cảm xúc của bạn",
    heroDescription:
      "AI phát hiện cảm xúc từ khuôn mặt, giọng nói và văn bản để đề xuất âm nhạc phù hợp cho bạn",
    getStarted: "Bắt đầu ngay",
    learnMore: "Tìm hiểu thêm",
    howItWorks: "Cách hoạt động",
    features: "Tính năng",
    pricing: "Bảng giá",
    testimonials: "Đánh giá",
  },
  en: {
    home: "Home",
    dashboard: "Dashboard",
    nowPlaying: "Now Playing",
    discover: "Discover",
    library: "Library",
    recommendations: "Recommendations",
    history: "History",
    analytics: "Analytics",
    settings: "Settings",
    emotionDetection: "Emotion Detection",
    search: "Search",
    notifications: "Notifications",
    profile: "Profile",
    language: "Language",
    logout: "Logout",
    happy: "Happy",
    sad: "Sad",
    calm: "Calm",
    angry: "Angry",
    romantic: "Romantic",
    nostalgic: "Nostalgic",
    energetic: "Energetic",
    stressed: "Stressed",
    welcome: "Welcome",
    currentMood: "Current Mood",
    fusionScore: "Fusion Score",
    nowPlayingLabel: "Now Playing",
    recommendationCount: "Recommendations",
    recentlyPlayed: "Recently Played",
    continueListening: "Continue Listening",
    forYou: "For You",
    moodTrend: "Mood Trend",
    faceDetection: "Face Detection",
    voiceAnalysis: "Voice Analysis",
    textMood: "Text Analysis",
    multimodal: "Multimodal",
    startAnalysis: "Start Analysis",
    analyzing: "Analyzing...",
    confidence: "Confidence",
    finalResult: "Final Result",
    inputPlaceholder: "Enter how you feel...",
    lyrics: "Lyrics",
    queue: "Queue",
    outputDevice: "Output Device",
    relatedTracks: "Related Tracks",
    addToFavorite: "Add to Favorites",
    share: "Share",
    basedOnMood: "Based on Mood",
    trending: "Trending",
    focus: "Focus",
    sleep: "Sleep",
    workout: "Workout",
    healing: "Healing",
    matchesMood: "Matches your current mood",
    detectedSad: "Suggested after detecting sadness",
    boostEnergy: "Boost energy",
    reduceStress: "Reduce stress",
    listeningHistory: "Listening History",
    weeklyStats: "Weekly Stats",
    mostPlayed: "Most Played",
    topGenre: "Top Genre",
    totalTime: "Total Time",
    moodAnalytics: "Mood Analytics",
    listeningDuration: "Listening Duration",
    emotionDistribution: "Emotion Distribution",
    favoriteGenres: "Favorite Genres",
    peakListening: "Peak Listening Hours",
    weekly: "Weekly",
    monthly: "Monthly",
    profileSettings: "Profile Settings",
    themeSettings: "Theme",
    musicPreferences: "Music Preferences",
    inputMode: "Input Mode",
    notificationSettings: "Notifications",
    privacySettings: "Privacy",
    connectedServices: "Connected Services",
    saveChanges: "Save Changes",
    free: "Free",
    plus: "Plus",
    vipPro: "VIP Pro",
    upgrade: "Upgrade",
    currentPlan: "Current Plan",
    tagline: "Music that follows your mood",
    heroDescription:
      "AI detects emotion from face, voice, and text to recommend the perfect soundtrack",
    getStarted: "Get Started",
    learnMore: "Learn More",
    howItWorks: "How it Works",
    features: "Features",
    pricing: "Pricing",
    testimonials: "Testimonials",
  },
} as const;

export interface MockEmotionItem {
  id: Emotion;
  labelVi: string;
  labelEn: string;
  color: string;
  emoji: string;
}

export interface MockGenre {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface MockArtist {
  id: string;
  name: string;
  imageUrl: string;
  followers: string;
}

export interface HistoryRecord {
  id: string;
  songId: string;
  emotion: Emotion;
  source: "face" | "voice" | "text" | "multimodal";
  action: "played" | "liked" | "added_to_queue" | "skipped";
  timestamp: string;
}

export const themePalette: Record<
  SongTheme,
  { primary: string; secondary: string }
> = {
  pink: { primary: "#ff5db1", secondary: "#ff8ec7" },
  red: { primary: "#ff5d5d", secondary: "#ff9867" },
  blue: { primary: "#4f8cff", secondary: "#73b7ff" },
  green: { primary: "#22c55e", secondary: "#2dd4bf" },
  violet: { primary: "#8b5cf6", secondary: "#c084fc" },
  sepia: { primary: "#d97706", secondary: "#f59e0b" },
  cyan: { primary: "#06b6d4", secondary: "#67e8f9" },
};

const taoLoiVi = (moc: string[]) => moc;
const taoLoiEn = (moc: string[]) => moc;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const taoTaiNguyenCongKhai = (thuMuc: "img" | "audio", tenFile: string) => {
  const endpoint = thuMuc === "audio" ? "media" : "images";

  return `${API_BASE_URL}/${endpoint}/${encodeURIComponent(tenFile)}`;
};

const anh = (tenFile: string) => taoTaiNguyenCongKhai("img", tenFile);
const nhac = (tenFile: string) => taoTaiNguyenCongKhai("audio", tenFile);

const taoBaiHat = (duLieu: Omit<Song, "palette">): Song => ({
  ...duLieu,
  palette: themePalette[duLieu.theme],
});

export const mockSongs: Song[] = [
  taoBaiHat({
    id: "1",
    title: "As If It's Your Last",
    artist: "BLACKPINK",
    album: "Square Two",
    duration: 214,
    theme: "pink",
    coverUrl: anh("as-if-your.png"),
    audioUrl: nhac(
      `(20) BLACKPINK - '마지막처럼 (AS IF IT'S YOUR LAST)' M-V - YouTube.mp3`,
    ),
    emotion: "happy",
    mood: "happy",
    lyricsVi: taoLoiVi([
      "Như thể đây là lần cuối cùng",
      "Hãy ôm em thật lâu thêm chút nữa",
      "Trái tim em rung lên rất nhanh",
      "Đừng để khoảnh khắc này trôi qua",
      "Em muốn yêu như chưa từng được yêu",
      "Hãy hôn em như lần cuối hôm nay",
    ]),
    lyricsEn: taoLoiEn([
      "Like this is our last time together",
      "Hold me a little longer tonight",
      "My heart is racing faster now",
      "Do not let this moment pass away",
      "I want to love like never before",
      "Kiss me like it is the last tonight",
    ]),
    relatedSongIds: ["2", "3", "8", "11"],
  }),
  taoBaiHat({
    id: "2",
    title: "Dream",
    artist: "LISA",
    album: "LALISA Era",
    duration: 198,
    theme: "violet",
    coverUrl: anh("dream.png"),
    audioUrl: nhac(
      "(20) LISA - DREAM feat. Kentaro Sakaguchi (Official Short Film MV) - YouTube.mp3",
    ),
    emotion: "romantic",
    mood: "romantic",
    lyricsVi: taoLoiVi([
      "Em rơi vào giấc mơ rất sâu",
      "Nơi có anh đứng chờ bên kia",
      "Ánh đèn đêm lung linh dịu dàng",
      "Mọi lo âu dường như tan biến",
      "Chạm vào nhau như một giấc mộng",
      "Và em muốn thời gian ngừng lại",
    ]),
    lyricsEn: taoLoiEn([
      "I fall into a dream so deep",
      "Where you are waiting on the other side",
      "Night lights shimmer softly around us",
      "All my worries slowly fade away",
      "We touch like a beautiful dream",
      "And I want time to stop right here",
    ]),
    relatedSongIds: ["1", "8", "12", "6"],
  }),
  taoBaiHat({
    id: "3",
    title: "How You Like That",
    artist: "BLACKPINK",
    album: "The Album",
    duration: 181,
    theme: "red",
    coverUrl: anh("how-you-like.png"),
    audioUrl: nhac(`(20) BLACKPINK - 'How You Like That' M-V - YouTube.mp3`),
    emotion: "energetic",
    mood: "energetic",
    lyricsVi: taoLoiVi([
      "Rơi xuống thật sâu rồi lại đứng dậy",
      "Ánh đèn bừng sáng trong màn đêm",
      "Nhịp trống kéo em ra khỏi bóng tối",
      "Em bước đi đầy kiêu hãnh hơn",
      "Giờ hãy nhìn em thay đổi thế nào",
      "Nói đi, anh thấy sao nào",
    ]),
    lyricsEn: taoLoiEn([
      "Fell down so deep then rose again",
      "Lights burst open in the dark",
      "The drums pull me out of the shadows",
      "Now I walk with stronger pride",
      "Look at how much I have changed",
      "Tell me now, how do you like that",
    ]),
    relatedSongIds: ["1", "9", "12", "11"],
  }),
  taoBaiHat({
    id: "4",
    title: "Anh Vui x Dia Nguc Tran Gian",
    artist: "Pham Ky",
    album: "SS Remix Collection",
    duration: 245,
    theme: "sepia",
    coverUrl: anh("anhvui.png"),
    audioUrl: nhac(
      "(20) Anh Vui x Địa Ngục Trần Gian (SS Remix) - Phạm Kỳ - Những Cánh Hoa Rơi - Anh Vui Đến Nỗi Nghẹn Ngào - YouTube.mp3",
    ),
    emotion: "nostalgic",
    mood: "nostalgic",
    lyricsVi: taoLoiVi([
      "Nhung canh hoa roi trong dem vang",
      "Anh vui den noi nghe nghen ngao",
      "Nhip nho cu cuon theo hoi tho",
      "Mot chut dau long con o lai",
      "Ky uc xua cham vao noi nho",
      "Va ta lang nghe dem troi qua",
    ]),
    lyricsEn: taoLoiEn([
      "Falling petals in a golden night",
      "I am happy until I choke with tears",
      "Old memories follow every breath",
      "A little ache still stays behind",
      "The past touches this quiet longing",
      "And we listen as the night moves on",
    ]),
    relatedSongIds: ["10", "5", "7", "11"],
  }),
  taoBaiHat({
    id: "5",
    title: "Nhung Canh Hoa Roi",
    artist: "Pham Ky",
    album: "Acoustic Session",
    duration: 232,
    theme: "blue",
    coverUrl: anh("bai-hat-nay.png"),
    audioUrl: nhac(
      "(20) T.R.I - một bài hát không vui mấy (sad ver.) l OFFICIAL VISUALIZER - YouTube.mp3",
    ),
    emotion: "sad",
    mood: "sad",
    lyricsVi: taoLoiVi([
      "Canh hoa roi trong chieu muon",
      "Con du am cua mot cuoc tinh",
      "Gio di qua lam em nho them",
      "Va nuoc mat roi that khe",
      "Neu mai nay ta xa nhau",
      "Xin giu lai mot lan cuoi",
    ]),
    lyricsEn: taoLoiEn([
      "Petals fall in the late afternoon",
      "Still warm from a love we had",
      "The wind passes and I miss you more",
      "Tears quietly start to fall",
      "If tomorrow we drift apart",
      "Please keep one last memory of us",
    ]),
    relatedSongIds: ["4", "10", "7", "2"],
  }),
  taoBaiHat({
    id: "6",
    title: "Pink Sunset Rush",
    artist: "Luna Nova",
    album: "Chromatic Dreams",
    duration: 214,
    theme: "pink",
    coverUrl: anh("go.png"),
    audioUrl: nhac("(20) BLACKPINK - GO M-V - YouTube.mp3"),
    emotion: "happy",
    mood: "happy",
    lyricsVi: taoLoiVi([
      "Khi nang chieu roi tren vai em",
      "Duong pho hong len theo giac mo",
      "Ta cu the cuoi trong tieng nhac",
      "Nhu chua tung co dieu buon nao",
      "Cung nhau chay qua mien hoang hon",
      "De trai tim vuon sang ruc ro",
    ]),
    lyricsEn: taoLoiEn([
      "When sunset light falls on your shoulder",
      "The streets turn pink inside a dream",
      "We keep smiling inside the music",
      "As if sadness never existed",
      "Run with me through the glowing dusk",
      "Let the heart bloom bright tonight",
    ]),
    relatedSongIds: ["1", "11", "8", "2"],
  }),
  taoBaiHat({
    id: "7",
    title: "Blue After Rain",
    artist: "Midnight Echo",
    album: "Ocean Depths",
    duration: 256,
    theme: "blue",
    coverUrl: anh("nhung-loi-hua-bo-quen.png"),
    audioUrl: nhac(
      "(20) NHỮNG LỜI HỨA BỎ QUÊN - VŨ. x DEAR JANE (Official MV) tư Album -Bao Tang Cua Nuôi Tiêc- - YouTube.mp3",
    ),
    emotion: "sad",
    mood: "sad",
    lyricsVi: taoLoiVi([
      "Sau cơn mưa là khoảng trời xanh",
      "Nhưng lòng em vẫn còn rất buồn",
      "Từng bước chân nghe như thật chậm",
      "Giữa con đường đầy gió heo may",
      "Hy vọng mong manh còn ở đó",
      "Dịu dàng như ánh sáng sau mưa",
    ]),
    lyricsEn: taoLoiEn([
      "After the rain the sky turns blue",
      "But my heart still feels so heavy",
      "Every step sounds painfully slow",
      "On a road full of cold wind",
      "A fragile hope still stays somewhere",
      "Soft like the light after the rain",
    ]),
    relatedSongIds: ["5", "10", "4", "2"],
  }),
  taoBaiHat({
    id: "8",
    title: "Rose Garden",
    artist: "Luna Nova",
    album: "Chromatic Dreams",
    duration: 203,
    theme: "pink",
    coverUrl: anh("yeu-la-tha-thu.png"),
    audioUrl: nhac(
      "(20) Yêu là -Tha Thu- - Only C - Em Chưa 18 OST - Lyric + vietsub - [PNAK Release] - YouTube.mp3",
    ),
    emotion: "romantic",
    mood: "romantic",
    lyricsVi: taoLoiVi([
      "Vuon hong no trong tim em",
      "Moi anh cuoi nhu nang dau mua",
      "Chan cham nhau nghe xao xuyen",
      "Dem im lang ma that ngot ngao",
      "Tinh yeu khe rop vao tai",
      "Va the gioi nhu dung lai",
    ]),
    lyricsEn: taoLoiEn([
      "A rose garden blooms in my heart",
      "Your smile feels like the first sun",
      "Our footsteps brush and tremble",
      "The night is quiet and so sweet",
      "Love whispers softly to my ear",
      "And the world seems to stop",
    ]),
    relatedSongIds: ["2", "12", "1", "6"],
  }),
  taoBaiHat({
    id: "9",
    title: "Storm Chaser",
    artist: "Thunder Pulse",
    album: "Electric Sky",
    duration: 176,
    theme: "red",
    coverUrl: anh("laviai.png"),
    audioUrl: nhac(
      "(20) WXRDIE - LAVIAI (REMIX) ft. HIEUTHUHAI & 2PILLZ - YouTube.mp3",
    ),
    emotion: "energetic",
    mood: "energetic",
    lyricsVi: taoLoiVi([
      "Chay qua gio bao khong dung lai",
      "Nhip tim nhanh hon tung giay",
      "Tat ca nhu bung no truoc mat",
      "Khong con so hai giua dem den",
      "Ta duoi theo anh sang xa",
      "Va pha vo moi gioi han",
    ]),
    lyricsEn: taoLoiEn([
      "Running through the storm nonstop",
      "My heartbeat moves faster each second",
      "Everything explodes before my eyes",
      "No fear remains in the dark night",
      "We chase that distant light ahead",
      "And break through every limit",
    ]),
    relatedSongIds: ["3", "11", "12", "6"],
  }),
  taoBaiHat({
    id: "10",
    title: "Velvet Night",
    artist: "Midnight Echo",
    album: "Shadows Dance",
    duration: 289,
    theme: "violet",
    coverUrl: anh("mot-trieu-kha-nang.png"),
    audioUrl: nhac(
      "(20) [Vietsub + Kara] Một triệu khả năng - Trương Hàm Vận - 一百万个可能 张含韵 - YouTube.mp3",
    ),
    emotion: "calm",
    mood: "calm",
    lyricsVi: taoLoiVi([
      "Dem nhung mem nhu lua tim",
      "Tieng dan ru mot noi buon nhe",
      "Em ngoi yen giua can phong vang",
      "Nghe hoi tho cua gio ben rem",
      "Mong cho long binh yen tro lai",
      "Trong man dem that rat diu em",
    ]),
    lyricsEn: taoLoiEn([
      "The night is soft like velvet light",
      "A guitar hums a gentle ache",
      "I sit still in an empty room",
      "Listening to the wind by the curtain",
      "Wishing for peace to come again",
      "In a tender quiet midnight",
    ]),
    relatedSongIds: ["7", "4", "5", "2"],
  }),
  taoBaiHat({
    id: "11",
    title: "Summer Wine",
    artist: "Sunset Collective",
    album: "Golden Hour",
    duration: 234,
    theme: "sepia",
    coverUrl: anh("maigc-in-the-air.png"),
    audioUrl: nhac(
      "(20) MAGIC SYSTEM - Magic In The Air Feat. Chawki [Clip Officiel] - YouTube.mp3",
    ),
    emotion: "happy",
    mood: "happy",
    lyricsVi: taoLoiVi([
      "Mua he ngot nhu ly ruou vang",
      "Tieng cuoi xoay quanh pho nho",
      "Anh nhin em trong chieu mat",
      "Moi dieu buon bong hoa nhe tenh",
      "Ta giu mua he trong ban tay",
      "Va hat cung nhau den toi",
    ]),
    lyricsEn: taoLoiEn([
      "Summer tastes like sweet wine",
      "Laughter spins around the street",
      "I see you in the golden dusk",
      "Every sadness becomes light",
      "We hold the summer in our hands",
      "And sing together till the night",
    ]),
    relatedSongIds: ["6", "1", "3", "9"],
  }),
  taoBaiHat({
    id: "12",
    title: "Scarlet Dreams",
    artist: "Ember Kings",
    album: "Passion Play",
    duration: 267,
    theme: "red",
    coverUrl: anh("chiu-cach-minh.png"),
    audioUrl: nhac(
      "(20) RHYDER - CHỊU CÁCH MÌNH NÓI THUA - ft. BAN x COOLKID - OFFICIAL MUSIC VIDEO - YouTube.mp3",
    ),
    emotion: "romantic",
    mood: "romantic",
    lyricsVi: taoLoiVi([
      "Giấc mơ đỏ rực trong tim",
      "Mắt chạm mắt như tia lửa",
      "Ta tiến gần thêm một chút",
      "Nghe đêm nở đầy say đắm",
      "Những lời yêu chưa kịp nói",
      "Cũng hóa thành ngọn lửa hồng",
    ]),
    lyricsEn: taoLoiEn([
      "Scarlet dreams burn in my heart",
      "Eyes meet like sudden sparks",
      "We move a little closer now",
      "The night blossoms with desire",
      "Words of love left unspoken",
      "Turn into a glowing fire",
    ]),
    relatedSongIds: ["8", "2", "3", "1"],
  }),
];

export const mockPlaylists: Playlist[] = [
  {
    id: "pl1",
    name: { vi: "Kpop Vui Ve", en: "Happy Kpop" },
    description: {
      vi: "Nhung bai nhac bat tai de nghe luc vui ve",
      en: "High energy songs for a happy mood",
    },
    coverUrl: anh("as-if-your.png"),
    songCount: 24,
    duration: "1h 32m",
    theme: "pink",
    emotion: "happy",
    mood: "happy",
    songs: mockSongs.filter((song) => ["1", "3", "6", "11"].includes(song.id)),
  },
  {
    id: "pl2",
    name: { vi: "Dem Lang Man", en: "Romantic Night" },
    description: {
      vi: "Goi y danh cho luc muon nghe nhac tinh cam",
      en: "Late night romantic mood",
    },
    coverUrl: anh("dream.png"),
    songCount: 18,
    duration: "1h 15m",
    theme: "violet",
    emotion: "romantic",
    mood: "romantic",
    songs: mockSongs.filter((song) => ["2", "8", "12"].includes(song.id)),
  },
  {
    id: "pl3",
    name: { vi: "Sau Con Mua", en: "After Rain" },
    description: {
      vi: "Nhac nhe cho luc can ngoi yen",
      en: "Gentle songs for a quiet mood",
    },
    coverUrl: anh("nhung-loi-hua-bo-quen.png"),
    songCount: 16,
    duration: "58m",
    theme: "blue",
    emotion: "sad",
    mood: "sad",
    songs: mockSongs.filter((song) => ["5", "7", "10"].includes(song.id)),
  },
  {
    id: "pl4",
    name: { vi: "Bung No Nang Luong", en: "Energy Burst" },
    description: {
      vi: "Nhac manh de tap trung va van dong",
      en: "Power tracks for action",
    },
    coverUrl: anh("how-you-like.png"),
    songCount: 20,
    duration: "1h 08m",
    theme: "red",
    emotion: "energetic",
    mood: "energetic",
    songs: mockSongs.filter((song) => ["3", "9"].includes(song.id)),
  },
  {
    id: "pl5",
    name: { vi: "Ky Uc Mua Cu", en: "Old Memories" },
    description: {
      vi: "Nhac cho nhung luc can mot chut hoai niem",
      en: "Soft nostalgic tracks",
    },
    coverUrl: anh("anhvui.png"),
    songCount: 22,
    duration: "1h 24m",
    theme: "sepia",
    emotion: "nostalgic",
    mood: "nostalgic",
    songs: mockSongs.filter((song) => ["4", "5"].includes(song.id)),
  },
  {
    id: "pl6",
    name: { vi: "Thu Gian Ban Dem", en: "Midnight Calm" },
    description: {
      vi: "Giai dieu de nghi ngoi va thu thai",
      en: "Calm and relaxing tracks",
    },
    coverUrl: anh("mot-trieu-kha-nang.png"),
    songCount: 30,
    duration: "2h 10m",
    theme: "cyan",
    emotion: "calm",
    mood: "calm",
    songs: mockSongs.filter((song) => ["10"].includes(song.id)),
  },
];

export interface MockAnalytics {
  weeklyListening: { day: string; hours: number }[];
  emotionDistribution: { emotion: Emotion; percentage: number }[];
  topGenres: { genre: string; percentage: number }[];
  peakHours: { hour: string; listens: number }[];
  moodTrend: { date: string; mood: Emotion; score: number }[];
}

export const mockEmotions: MockEmotionItem[] = [
  {
    id: "happy",
    labelVi: "Vui vẻ",
    labelEn: "Happy",
    color: "#f59e0b",
    emoji: "😊",
  },
  {
    id: "calm",
    labelVi: "Bình yên",
    labelEn: "Calm",
    color: "#10b981",
    emoji: "😌",
  },
  {
    id: "energetic",
    labelVi: "Năng động",
    labelEn: "Energetic",
    color: "#ef4444",
    emoji: "⚡",
  },
  {
    id: "romantic",
    labelVi: "Lãng mạn",
    labelEn: "Romantic",
    color: "#ec4899",
    emoji: "💖",
  },
  {
    id: "nostalgic",
    labelVi: "Hoài niệm",
    labelEn: "Nostalgic",
    color: "#d97706",
    emoji: "🕰️",
  },
  { id: "sad", labelVi: "Buồn", labelEn: "Sad", color: "#3b82f6", emoji: "😢" },
  {
    id: "stressed",
    labelVi: "Căng thẳng",
    labelEn: "Stressed",
    color: "#64748b",
    emoji: "😵",
  },
  {
    id: "angry",
    labelVi: "Tức giận",
    labelEn: "Angry",
    color: "#dc2626",
    emoji: "😤",
  },
];

export const mockGenres: MockGenre[] = [
  { id: "kpop", name: "K-Pop", color: "#ec4899", icon: "🎤" },
  { id: "pop", name: "Pop", color: "#f59e0b", icon: "🎵" },
  { id: "rnb", name: "R&B", color: "#8b5cf6", icon: "🎶" },
  { id: "indie", name: "Indie", color: "#10b981", icon: "🌿" },
  { id: "lofi", name: "Lo-fi", color: "#06b6d4", icon: "☕" },
  { id: "electronic", name: "Electronic", color: "#ef4444", icon: "🎛️" },
];

export const mockArtists: MockArtist[] = [
  {
    id: "a1",
    name: "BLACKPINK",
    imageUrl: anh("as-if-your.png"),
    followers: "96M",
  },
  { id: "a2", name: "LISA", imageUrl: anh("dream.png"), followers: "104M" },
  { id: "a3", name: "Pham Ky", imageUrl: anh("anhvui.png"), followers: "1.5M" },
  { id: "a4", name: "Luna Nova", imageUrl: anh("go.png"), followers: "540K" },
  {
    id: "a5",
    name: "Midnight Echo",
    imageUrl: anh("mot-trieu-kha-nang.png"),
    followers: "420K",
  },
];

export const mockHistoryRecords: HistoryRecord[] = [
  {
    id: "hr1",
    songId: "1",
    emotion: "happy",
    source: "multimodal",
    action: "played",
    timestamp: "09:15",
  },
  {
    id: "hr2",
    songId: "2",
    emotion: "romantic",
    source: "voice",
    action: "liked",
    timestamp: "10:30",
  },
  {
    id: "hr3",
    songId: "4",
    emotion: "nostalgic",
    source: "text",
    action: "played",
    timestamp: "12:05",
  },
  {
    id: "hr4",
    songId: "5",
    emotion: "sad",
    source: "face",
    action: "skipped",
    timestamp: "13:20",
  },
  {
    id: "hr5",
    songId: "6",
    emotion: "happy",
    source: "multimodal",
    action: "played",
    timestamp: "15:10",
  },
  {
    id: "hr6",
    songId: "3",
    emotion: "energetic",
    source: "text",
    action: "liked",
    timestamp: "16:25",
  },
  {
    id: "hr7",
    songId: "10",
    emotion: "calm",
    source: "face",
    action: "added_to_queue",
    timestamp: "18:40",
  },
  {
    id: "hr8",
    songId: "8",
    emotion: "romantic",
    source: "voice",
    action: "played",
    timestamp: "20:05",
  },
];

export const mockUser: User = {
  id: "user1",
  name: "Minh Anh",
  avatar: "/placeholder-user.jpg",
  tier: "plus",
  preferredLanguage: "vi",
};

export const mockAnalytics: MockAnalytics = {
  weeklyListening: [
    { day: "T2", hours: 2.5 },
    { day: "T3", hours: 3.2 },
    { day: "T4", hours: 1.8 },
    { day: "T5", hours: 4.1 },
    { day: "T6", hours: 3.7 },
    { day: "T7", hours: 5.2 },
    { day: "CN", hours: 4.8 },
  ],
  emotionDistribution: [
    { emotion: "happy", percentage: 28 },
    { emotion: "calm", percentage: 24 },
    { emotion: "energetic", percentage: 18 },
    { emotion: "romantic", percentage: 12 },
    { emotion: "nostalgic", percentage: 10 },
    { emotion: "sad", percentage: 5 },
    { emotion: "stressed", percentage: 3 },
  ],
  topGenres: [
    { genre: "K-Pop", percentage: 35 },
    { genre: "Lo-Fi", percentage: 25 },
    { genre: "R&B", percentage: 20 },
    { genre: "Indie", percentage: 12 },
    { genre: "Electronic", percentage: 8 },
  ],
  peakHours: [
    { hour: "6AM", listens: 12 },
    { hour: "9AM", listens: 45 },
    { hour: "12PM", listens: 38 },
    { hour: "3PM", listens: 52 },
    { hour: "6PM", listens: 78 },
    { hour: "9PM", listens: 95 },
    { hour: "12AM", listens: 42 },
  ],
  moodTrend: [
    { date: "01/03", mood: "happy", score: 85 },
    { date: "02/03", mood: "calm", score: 72 },
    { date: "03/03", mood: "energetic", score: 90 },
    { date: "04/03", mood: "nostalgic", score: 65 },
    { date: "05/03", mood: "happy", score: 88 },
    { date: "06/03", mood: "romantic", score: 78 },
    { date: "07/03", mood: "calm", score: 70 },
  ],
};

export const mockListeningHistory: ListeningHistory[] = mockSongs
  .slice(0, 8)
  .map((song, index) => ({
    id: `history-${index}`,
    song,
    emotion: song.emotion,
    source: (["face", "voice", "text", "fusion"] as const)[index % 4],
    timestamp: new Date(Date.now() - index * 3600000),
    duration: Math.floor(song.duration * 0.8),
  }));

export const emotionColors: Record<
  Emotion,
  { bg: string; text: string; glow: string }
> = {
  happy: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    glow: "shadow-amber-500/30",
  },
  sad: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    glow: "shadow-blue-500/30",
  },
  calm: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/30",
  },
  angry: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    glow: "shadow-red-500/30",
  },
  romantic: {
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    glow: "shadow-pink-500/30",
  },
  nostalgic: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    glow: "shadow-orange-500/30",
  },
  energetic: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/30",
  },
  stressed: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    glow: "shadow-slate-500/30",
  },
};

export const themeGradients: Record<SongTheme, string> = {
  pink: "from-pink-500/30 via-rose-500/20 to-transparent",
  red: "from-red-500/30 via-orange-500/20 to-transparent",
  blue: "from-blue-500/30 via-indigo-500/20 to-transparent",
  green: "from-emerald-500/30 via-teal-500/20 to-transparent",
  violet: "from-violet-500/30 via-purple-500/20 to-transparent",
  sepia: "from-amber-600/30 via-orange-500/20 to-transparent",
  cyan: "from-cyan-500/30 via-teal-500/20 to-transparent",
};

export function formatDuration(seconds: number): string {
  const phut = Math.floor(seconds / 60);
  const giay = seconds % 60;
  return `${phut}:${giay.toString().padStart(2, "0")}`;
}

export function t(
  key: keyof typeof translations.vi,
  lang: Language = "vi",
): string {
  return translations[lang][key];
}

export type ApiTrack = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  duration: number;
  emotion?: Emotion | string | null;
  emotion_label_vi?: string | null;
  cover_image?: string | null;
  emotion_scores?: Record<string, number> | null;
};

function chuanHoaCamXuc(emotion?: string | null): Emotion {
  const allowed: Emotion[] = [
    "happy",
    "sad",
    "calm",
    "angry",
    "romantic",
    "nostalgic",
    "energetic",
    "stressed",
  ];

  if (emotion && allowed.includes(emotion as Emotion)) {
    return emotion as Emotion;
  }

  return "calm";
}

function layThemeTheoCamXuc(emotion: Emotion): SongTheme {
  const map: Record<Emotion, SongTheme> = {
    happy: "pink",
    sad: "blue",
    calm: "cyan",
    angry: "red",
    romantic: "violet",
    nostalgic: "sepia",
    energetic: "red",
    stressed: "green",
  };

  return map[emotion];
}

export function chuyenTrackApiThanhSong(track: ApiTrack): Song {
  const emotion = chuanHoaCamXuc(track.emotion);
  const theme = layThemeTheoCamXuc(emotion);

  return taoBaiHat({
    id: String(track.id),
    title: track.title,
    artist: track.artist,
    album: "MoodSync AI",
    duration: track.duration || 0,
    theme,
    coverUrl: track.cover_image ? anh(track.cover_image) : "/placeholder.svg",
    audioUrl: track.audio_url ? nhac(track.audio_url) : "",
    emotion,
    mood: emotion,
    lyricsVi: [],
    lyricsEn: [],
    relatedSongIds: [],
  });
}

export async function layBaiHatTuBackend(): Promise<Song[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const response = await fetch(`${API_BASE_URL}/tracks/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Không tải được danh sách bài hát: ${response.status}`);
  }

  const tracks = (await response.json()) as ApiTrack[];

  return tracks.map(chuyenTrackApiThanhSong);
}
