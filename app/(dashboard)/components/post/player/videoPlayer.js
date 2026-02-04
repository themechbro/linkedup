"use client";
import { useRef, useState, useEffect } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/joy";
import { Play, Pause, Volume2, VolumeX, Maximize, Repeat } from "lucide-react";
import Hls from "hls.js";

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
      });

      hls.loadSource(src);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setDuration(videoRef.current.duration);
      });
    } else {
      videoRef.current.src = src;
    }

    const video = videoRef.current;

    const updateProgress = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);
    const onEnded = () => {
      setEnded(true);
      setPlaying(false);
    };
    video.addEventListener("ended", onEnded);
    return () => {
      if (hls) hls.destroy();
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  // Play / Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (ended) {
      video.currentTime = 0;
      setEnded(false);
    }

    if (playing) {
      video.pause();
    } else {
      video.play();
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

  const handleSeek = (_, val) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const seekTime = (val / 100) * video.duration;

    video.currentTime = seekTime;
    setProgress(val);

    if (ended) {
      setEnded(false);
      video.play();
      setPlaying(true);
    }
  };

  // const handleLoaded = () => {
  //   setDuration(videoRef.current.duration);
  // };

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
        aspectRatio: "16/9",
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "black",
        cursor: "pointer",
      }}
      onMouseMove={() => setShowControls(true)}
      onClick={(e) => e.stopPropagation()}
    >
      <video
        ref={videoRef}
        // src={src}
        onClick={togglePlay}
        // onLoadedMetadata={handleLoaded}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
        }}
      />

      {/* Replay video overlay after ended */}
      {ended && (
        <Box
          onClick={togglePlay}
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            zIndex: 5,
            cursor: "pointer",
          }}
        >
          <IconButton
            size="lg"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            <Repeat size={36} />
          </IconButton>
        </Box>
      )}

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

              <Box sx={{ m: 2 }}>
                <Typography level="body-xs" color="#FFF">
                  {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                  {formatTime(duration)}
                </Typography>
              </Box>
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
