"use client";
import { useRef, useState, useEffect } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/joy";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  // Volume
  const handleVolume = (_, val) => {
    videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  // Progress
  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    setProgress((current / duration) * 100);
  };

  const handleSeek = (_, val) => {
    const time = (val / 100) * duration;
    videoRef.current.currentTime = time;
    setProgress(val);
  };

  const handleLoaded = () => {
    setDuration(videoRef.current.duration);
  };

  // Fullscreen
  const goFullscreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 2500);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "black",
        cursor: "pointer",
      }}
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoaded}
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      {/* Controls Overlay */}
      {showControls && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            color: "white",
          }}
        >
          {/* Seek Bar */}
          <Slider
            size="sm"
            value={progress}
            onChange={handleSeek}
            sx={{ color: "white" }}
          />

          {/* Bottom Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={togglePlay} size="sm" color="#FFF">
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </IconButton>

              <IconButton onClick={toggleMute} size="sm" color="#FFF">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </IconButton>

              <Box sx={{ width: 80 }}>
                <Slider
                  size="sm"
                  value={volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={handleVolume}
                />
              </Box>

              <Typography level="body-xs" color="#FFF">
                {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                {formatTime(duration)}
              </Typography>
            </Box>

            <IconButton onClick={goFullscreen} size="sm" color="#FFF">
              <Maximize size={18} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
