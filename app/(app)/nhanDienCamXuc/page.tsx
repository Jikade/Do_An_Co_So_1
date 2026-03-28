'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { cn } from '@/lib/tienIch';
import { ConfidenceBar } from '@/components/thanhDoTinCay';
import { MoodBadge } from '@/components/huyHieuCamXuc';
import { FusionScoreCard } from '@/components/theDiemKetHop';
import type { Emotion } from '@/lib/duLieuGiaLap';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Mic, 
  FileText, 
  Brain, 
  Play, 
  Square,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Zap
} from 'lucide-react';

type DetectionMode = 'face' | 'voice' | 'text' | 'multimodal';

interface DetectionLog {
  id: string;
  time: Date;
  source: DetectionMode;
  emotion: Emotion;
  confidence: number;
}

export default function EmotionDetectionPage() {
  const { 
    language, 
    t, 
    currentEmotion, 
    setCurrentEmotion,
    faceConfidence, 
    voiceConfidence, 
    textConfidence, 
    fusionScore,
    setConfidences
  } = useTheme();

  const [mode, setMode] = useState<DetectionMode>('multimodal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [detectionLogs, setDetectionLogs] = useState<DetectionLog[]>([
    { id: '1', time: new Date(Date.now() - 300000), source: 'multimodal', emotion: 'happy', confidence: 92 },
    { id: '2', time: new Date(Date.now() - 600000), source: 'face', emotion: 'calm', confidence: 85 },
    { id: '3', time: new Date(Date.now() - 900000), source: 'voice', emotion: 'energetic', confidence: 78 },
  ]);

  const emotions: Emotion[] = ['happy', 'sad', 'calm', 'angry', 'romantic', 'nostalgic', 'energetic', 'stressed'];

  const modeConfig = {
    face: { 
      icon: Camera, 
      label: language === 'vi' ? 'Khuôn mặt' : 'Face Only',
      description: language === 'vi' ? 'Phân tích biểu cảm khuôn mặt' : 'Analyze facial expressions'
    },
    voice: { 
      icon: Mic, 
      label: language === 'vi' ? 'Giọng nói' : 'Voice Only',
      description: language === 'vi' ? 'Phân tích âm thanh giọng nói' : 'Analyze voice audio'
    },
    text: { 
      icon: FileText, 
      label: language === 'vi' ? 'Văn bản' : 'Text Only',
      description: language === 'vi' ? 'Phân tích nội dung văn bản' : 'Analyze text content'
    },
    multimodal: { 
      icon: Brain, 
      label: language === 'vi' ? 'Đa phương thức' : 'Multimodal',
      description: language === 'vi' ? 'Kết hợp tất cả nguồn' : 'Combine all sources'
    },
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const newFaceConf = Math.floor(Math.random() * 20) + 80;
      const newVoiceConf = Math.floor(Math.random() * 25) + 70;
      const newTextConf = Math.floor(Math.random() * 20) + 75;
      
      setConfidences(newFaceConf, newVoiceConf, newTextConf);
      setCurrentEmotion(randomEmotion);
      
      setDetectionLogs(prev => [{
        id: Date.now().toString(),
        time: new Date(),
        source: mode,
        emotion: randomEmotion,
        confidence: Math.round((newFaceConf + newVoiceConf + newTextConf) / 3)
      }, ...prev].slice(0, 10));
      
      setIsAnalyzing(false);
    }, 2500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t('emotionDetection')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'vi' 
            ? 'AI phân tích cảm xúc của bạn từ nhiều nguồn khác nhau'
            : 'AI analyzes your emotions from multiple sources'}
        </p>
      </div>

      {/* Mode Selection */}
      <div className="glass rounded-2xl p-4">
        <p className="text-sm font-medium text-foreground mb-3">
          {language === 'vi' ? 'Chọn chế độ phát hiện' : 'Select detection mode'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(modeConfig) as DetectionMode[]).map((m) => {
            const config = modeConfig[m];
            const Icon = config.icon;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'p-4 rounded-xl border transition-all text-left',
                  mode === m 
                    ? 'border-[var(--song-primary)] bg-[var(--song-primary)]/10' 
                    : 'border-border/50 hover:border-border hover:bg-secondary/30'
                )}
              >
                <Icon className={cn(
                  'w-6 h-6 mb-2',
                  mode === m ? 'text-[var(--song-primary)]' : 'text-muted-foreground'
                )} />
                <p className={cn(
                  'font-medium text-sm',
                  mode === m ? 'text-[var(--song-primary)]' : 'text-foreground'
                )}>
                  {config.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {config.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Face Detection Panel */}
            <div className={cn(
              'glass rounded-2xl p-4 transition-all',
              (mode === 'face' || mode === 'multimodal') && 'ring-1 ring-[var(--song-primary)]/50'
            )}>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-[var(--song-primary)]" />
                <span className="text-sm font-medium text-foreground">{t('faceDetection')}</span>
                {(mode === 'face' || mode === 'multimodal') && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    {language === 'vi' ? 'Đang hoạt động' : 'Active'}
                  </span>
                )}
              </div>
              <div className="aspect-video rounded-xl bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                {isAnalyzing && (mode === 'face' || mode === 'multimodal') ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-[var(--song-primary)]/30 border-t-[var(--song-primary)] animate-spin mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {language === 'vi' ? 'Đang phân tích...' : 'Analyzing...'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {language === 'vi' ? 'Camera preview' : 'Camera preview'}
                    </p>
                  </div>
                )}
                {/* Face detection overlay */}
                {isAnalyzing && (mode === 'face' || mode === 'multimodal') && (
                  <div className="absolute inset-4 border-2 border-[var(--song-primary)] rounded-xl animate-pulse" />
                )}
              </div>
              <div className="mt-3">
                <ConfidenceBar 
                  label={t('confidence')} 
                  value={faceConfidence} 
                  color="primary"
                />
              </div>
            </div>

            {/* Voice Analysis Panel */}
            <div className={cn(
              'glass rounded-2xl p-4 transition-all',
              (mode === 'voice' || mode === 'multimodal') && 'ring-1 ring-[var(--song-primary)]/50'
            )}>
              <div className="flex items-center gap-2 mb-3">
                <Mic className="w-4 h-4 text-[var(--song-primary)]" />
                <span className="text-sm font-medium text-foreground">{t('voiceAnalysis')}</span>
                {(mode === 'voice' || mode === 'multimodal') && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    {language === 'vi' ? 'Đang hoạt động' : 'Active'}
                  </span>
                )}
              </div>
              <div className="aspect-video rounded-xl bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                {isAnalyzing && (mode === 'voice' || mode === 'multimodal') ? (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-[var(--song-primary)] rounded-full animate-pulse"
                        style={{ 
                          height: `${20 + Math.random() * 40}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <Mic className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {language === 'vi' ? 'Waveform visualization' : 'Waveform visualization'}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <ConfidenceBar 
                  label={t('confidence')} 
                  value={voiceConfidence} 
                  color="secondary"
                />
              </div>
            </div>
          </div>

          {/* Text Input Panel */}
          <div className={cn(
            'glass rounded-2xl p-4 transition-all',
            (mode === 'text' || mode === 'multimodal') && 'ring-1 ring-[var(--song-primary)]/50'
          )}>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[var(--song-primary)]" />
              <span className="text-sm font-medium text-foreground">{t('textMood')}</span>
              {(mode === 'text' || mode === 'multimodal') && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {language === 'vi' ? 'Đang hoạt động' : 'Active'}
                </span>
              )}
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="w-full h-32 p-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[var(--song-primary)]/50"
            />
            <div className="mt-3">
              <ConfidenceBar 
                label={t('confidence')} 
                value={textConfidence} 
                color="accent"
              />
            </div>
          </div>

          {/* Start Analysis Button */}
          <Button
            size="lg"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white h-14 text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('analyzing')}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {t('startAnalysis')}
              </>
            )}
          </Button>

          {/* Final Result Card */}
          <div className="glass rounded-2xl p-6 bg-gradient-to-br from-[var(--song-primary)]/10 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-[var(--song-primary)]" />
              <span className="font-semibold text-foreground">{t('finalResult')}</span>
              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-[var(--song-primary)]/20 text-[var(--song-primary)]">
                {modeConfig[mode].label}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'vi' ? 'Cảm xúc được phát hiện' : 'Detected emotion'}
                </p>
                <MoodBadge emotion={currentEmotion} size="lg" animated />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'vi' ? 'Độ tin cậy tổng hợp' : 'Overall confidence'}
                </p>
                <div className="text-4xl font-bold text-[var(--song-primary)]">
                  {fusionScore}%
                </div>
              </div>
            </div>

            {/* Emotion chips */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'vi' ? 'Tất cả cảm xúc' : 'All emotions'}
              </p>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => (
                  <MoodBadge 
                    key={emotion} 
                    emotion={emotion} 
                    size="sm"
                    className={cn(
                      'cursor-pointer transition-all',
                      emotion === currentEmotion 
                        ? 'ring-2 ring-[var(--song-primary)] scale-105' 
                        : 'opacity-50 hover:opacity-80'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Status Panel */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[var(--song-primary)]" />
              <span className="text-sm font-medium text-foreground">
                {language === 'vi' ? 'Trạng thái AI' : 'AI Status'}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? 'Nguồn nhập' : 'Input Source'}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {modeConfig[mode].label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? 'Trạng thái' : 'Status'}
                </span>
                <span className={cn(
                  'text-sm font-medium flex items-center gap-1',
                  isAnalyzing ? 'text-amber-400' : 'text-emerald-400'
                )}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {language === 'vi' ? 'Đang xử lý' : 'Processing'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      {language === 'vi' ? 'Sẵn sàng' : 'Ready'}
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? 'Độ chính xác' : 'Accuracy'}
                </span>
                <span className="text-sm font-medium text-foreground">{fusionScore}%</span>
              </div>
            </div>
          </div>

          {/* Fusion Score Card */}
          <FusionScoreCard size="md" />

          {/* Confidence Breakdown */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[var(--song-primary)]" />
              <span className="text-sm font-medium text-foreground">
                {language === 'vi' ? 'Chi tiết độ tin cậy' : 'Confidence Breakdown'}
              </span>
            </div>
            <div className="space-y-4">
              <ConfidenceBar 
                label={language === 'vi' ? 'Khuôn mặt' : 'Face'} 
                value={faceConfidence} 
                color="primary"
                size="sm"
              />
              <ConfidenceBar 
                label={language === 'vi' ? 'Giọng nói' : 'Voice'} 
                value={voiceConfidence} 
                color="secondary"
                size="sm"
              />
              <ConfidenceBar 
                label={language === 'vi' ? 'Văn bản' : 'Text'} 
                value={textConfidence} 
                color="accent"
                size="sm"
              />
            </div>
          </div>

          {/* Detection Timeline */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-[var(--song-primary)]" />
              <span className="text-sm font-medium text-foreground">
                {language === 'vi' ? 'Lịch sử phát hiện' : 'Detection History'}
              </span>
            </div>
            <div className="space-y-3">
              {detectionLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-lg bg-[var(--song-primary)]/20 flex items-center justify-center">
                    <span className="text-[var(--song-primary)]">
                        {log.source === 'face' && <Camera className="w-4 h-4" />}
                        {log.source === 'voice' && <Mic className="w-4 h-4" />}
                        {log.source === 'text' && <FileText className="w-4 h-4" />}
                        {log.source === 'multimodal' && <Brain className="w-4 h-4" />}
                      </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <MoodBadge emotion={log.emotion} size="sm" />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {log.confidence}% • {formatTime(log.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
