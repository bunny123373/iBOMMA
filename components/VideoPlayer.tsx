'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Movie } from '@/lib/types';

interface VideoPlayerProps {
  movie: Movie;
  onTimeUpdate?: (time: number) => void;
  initialTime?: number;
  onEnded?: () => void;
}

export const VideoPlayer = ({ movie, onTimeUpdate, initialTime = 0, onEnded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [availableQualities, setAvailableQualities] = useState<{ height: number; label: string }[]>([]);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [availableAudioTracks, setAvailableAudioTracks] = useState<{ name: string }[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const hideControls = useCallback(() => {
    if (isPlaying) {
      setShowControls(false);
    }
  }, [isPlaying]);

  const resetHideControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(hideControls, 3000);
  }, [hideControls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !movie.hls) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      hls.loadSource(movie.hls);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const qualities = data.levels.map((level) => ({
          height: level.height,
          label: level.height >= 1080 ? '1080p' : level.height >= 720 ? '720p' : '480p',
        }));
        setAvailableQualities([{ height: 0, label: 'Auto' }, ...qualities]);
        setAvailableAudioTracks([{ name: 'Default' }]);
        setIsLoading(false);
        video.currentTime = initialTime;
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        if (level) {
          setCurrentQuality(level.height >= 1080 ? '1080p' : level.height >= 720 ? '720p' : '480p');
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = movie.hls;
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = initialTime;
        video.play().catch(() => setIsPlaying(false));
        setIsLoading(false);
      });
    }
  }, [movie.hls, initialTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    const handleDurationChange = () => setDuration(video.duration);
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [onTimeUpdate, onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progress = progressRef.current;
    if (!video || !progress) return;

    const rect = progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const changeQuality = (height: number) => {
    if (!hlsRef.current) return;
    if (height === 0) {
      hlsRef.current.currentLevel = -1;
      setCurrentQuality('Auto');
    } else {
      const levelIndex = hlsRef.current.levels.findIndex((l) => l.height === height);
      if (levelIndex !== -1) {
        hlsRef.current.currentLevel = levelIndex;
        setCurrentQuality(height >= 1080 ? '1080p' : height >= 720 ? '720p' : '480p');
      }
    }
    setShowQualityMenu(false);
  };

  const changeSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    resetHideControlsTimeout();
  };

  return (
    <div
      ref={containerRef}
      className="video-container aspect-video bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        onClick={(e) => e.stopPropagation()}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      )}

      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer">
          <button className="p-4 bg-mirror-primary/90 rounded-full hover:bg-mirror-primary transition-colors">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      <div
        className={`video-controls transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3">
          <div
            ref={progressRef}
            className="video-progress group"
            onClick={seek}
          >
            <div className="video-progress-buffered" style={{ width: `${buffered}%` }} />
            <div className="video-progress-filled" style={{ width: `${(currentTime / duration) * 100}%` }} />
            <div
              className="absolute w-3 h-3 bg-white rounded-full -top-1 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>

            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={changeVolume}
                className="w-20 h-1"
              />
            </div>

            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedMenu(false);
                  setShowAudioMenu(false);
                  setShowQualityMenu(!showQualityMenu);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white"
              >
                {currentQuality}
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden border border-white/20">
                  {availableQualities.map((q) => (
                    <button
                      key={q.height}
                      onClick={() => changeQuality(q.height)}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 ${
                        currentQuality === q.label ? 'text-mirror-primary' : 'text-white'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityMenu(false);
                  setShowSpeedMenu(false);
                  setShowAudioMenu(!showAudioMenu);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
              {showAudioMenu && availableAudioTracks.length > 1 && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden border border-white/20">
                  {availableAudioTracks.map((track, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (hlsRef.current) {
                          hlsRef.current.audioTrack = index;
                          setCurrentAudioTrack(index);
                        }
                        setShowAudioMenu(false);
                      }}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 ${
                        currentAudioTrack === index ? 'text-mirror-primary' : 'text-white'
                      }`}
                    >
                      {track.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityMenu(false);
                  setShowAudioMenu(false);
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden border border-white/20">
                  {speeds.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 ${
                        playbackSpeed === speed ? 'text-mirror-primary' : 'text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
