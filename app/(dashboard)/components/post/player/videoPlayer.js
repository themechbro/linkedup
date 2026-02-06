"use client";
import { useRef, useState, useEffect } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/joy";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Repeat,
  RotateCcw,
  RotateCw,
} from "lucide-react";
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
  const [buffering, setBuffering] = useState(false);

  /* ---------------- HLS SETUP ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 15,
        maxMaxBufferLength: 30,
        lowLatencyMode: false,
        backBufferLength: 10,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (video.duration) {
          setDuration(video.duration);
        }
      });

      hls.on(Hls.Events.BUFFER_STALLED, () => {
        setBuffering(true);
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        setBuffering(false);
      });
    } else {
      video.src = src;
    }

    const updateProgress = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
    };

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const onDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const onEnded = () => {
      setEnded(true);
      setPlaying(false);
    };

    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      if (hls) hls.destroy();
    };
  }, [src]);

  /* ---------------- CONTROLS ---------------- */

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (ended) {
      v.currentTime = 0;
      setEnded(false);
    }

    playing ? v.pause() : v.play();
    setPlaying(!playing);
  };

  const seekBy = (seconds) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;

    v.currentTime = Math.min(Math.max(0, v.currentTime + seconds), v.duration);

    if (ended) {
      setEnded(false);
      v.play();
      setPlaying(true);
    }
  };

  const handleSeek = (_, val) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = (val / 100) * v.duration;
    setProgress(val);
  };

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (_, val) => {
    videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const goFullscreen = () => {
    containerRef.current?.requestFullscreen();
  };

  /* ---------------- UI ---------------- */

  useEffect(() => {
    if (!showControls) return;
    const t = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(t);
  }, [showControls]);

  const formatTime = (sec = 0) =>
    `${Math.floor(sec / 60)}:${Math.floor(sec % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <Box
      ref={containerRef}
      onMouseMove={() => setShowControls(true)}
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        aspectRatio: "16 / 9",
        borderRadius: "20px",
        overflow: "hidden",
        bgcolor: "#000",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      <video
        ref={videoRef}
        onClick={togglePlay}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: "pointer",
        }}
      />

      {/* CENTER PLAY/PAUSE INDICATOR */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <Box
          sx={{
            opacity: showControls && !buffering && !ended ? 1 : 0,
            transform:
              showControls && !buffering && !ended ? "scale(1)" : "scale(0.8)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            bgcolor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {playing ? (
            <Pause size={36} color="white" fill="white" />
          ) : (
            <Play
              size={36}
              color="white"
              fill="white"
              style={{ marginLeft: "4px" }}
            />
          )}
        </Box>
      </Box>

      {/* BUFFERING SPINNER */}
      {buffering && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(5px)",
            zIndex: 6,
            animation: "fadeIn 0.2s ease-in",
            "@keyframes fadeIn": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Box
            sx={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(255, 255, 255, 0.2)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              "@keyframes spin": {
                to: { transform: "rotate(360deg)" },
              },
            }}
          />
          <Typography
            level="body-sm"
            sx={{
              mt: 2,
              color: "white",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            Buffering…
          </Typography>
        </Box>
      )}

      {/* REPLAY OVERLAY */}
      {ended && (
        <Box
          onClick={togglePlay}
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            zIndex: 6,
            animation: "fadeIn 0.3s ease-in",
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              width: "90px",
              height: "90px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              border: "3px solid rgba(255, 255, 255, 0.4)",
              "&:hover": {
                transform: "scale(1.1)",
                bgcolor: "rgba(255, 255, 255, 0.25)",
              },
            }}
          >
            <Repeat size={44} color="white" strokeWidth={2.5} />
          </Box>
        </Box>
      )}

      {/* CONTROLS BAR */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2.5,
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 70%, transparent 100%)",
          opacity: showControls ? 1 : 0,
          transform: showControls ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        {/* PROGRESS BAR */}
        <Slider
          value={progress}
          onChange={handleSeek}
          size="sm"
          sx={{
            mb: 2,
            "--Slider-trackSize": "5px",
            "--Slider-thumbSize": "16px",
            "& .MuiSlider-track": {
              background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
            },
            "& .MuiSlider-thumb": {
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.5)",
              },
            },
            "& .MuiSlider-rail": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
            },
          }}
        />

        {/* CONTROL BUTTONS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* Play/Pause */}
            <IconButton
              onClick={togglePlay}
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.05)",
                },
              }}
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </IconButton>

            {/* Skip Back */}
            <IconButton
              onClick={() => seekBy(-5)}
              sx={{
                color: "white",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <RotateCcw size={18} />
            </IconButton>

            {/* Skip Forward */}
            <IconButton
              onClick={() => seekBy(5)}
              sx={{
                color: "white",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <RotateCw size={18} />
            </IconButton>

            {/* Volume */}
            <IconButton
              onClick={toggleMute}
              sx={{
                color: "white",
                ml: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  transform: "scale(1.05)",
                },
              }}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </IconButton>

            {/* Time Display */}
            <Typography
              level="body-sm"
              sx={{
                ml: 2,
                color: "white",
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.3px",
                minWidth: "100px",
              }}
            >
              {formatTime(videoRef.current?.currentTime)} /{" "}
              {formatTime(duration)}
            </Typography>
          </Box>

          {/* Fullscreen */}
          <IconButton
            onClick={goFullscreen}
            sx={{
              color: "white",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.15)",
                transform: "scale(1.05)",
              },
            }}
          >
            <Maximize size={18} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
