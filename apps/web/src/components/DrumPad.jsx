"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Square,
  Circle,
  RotateCcw,
  Volume2,
  Settings,
} from "lucide-react";

export default function DrumPad() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [pattern, setPattern] = useState(
    Array(16)
      .fill(null)
      .map(() => ({})),
  );
  const [activePads, setActivePads] = useState(new Set());

  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const buffersRef = useRef({});

  // Drum pad configuration
  const drumPads = [
    {
      id: 0,
      name: "Kick",
      key: "Q",
      color: "#8B70F6",
      sampleUrl: "/samples/kick.wav",
    },
    {
      id: 1,
      name: "Snare",
      key: "W",
      color: "#FF6B9D",
      sampleUrl: "/samples/snare.wav",
    },
    {
      id: 2,
      name: "Clap",
      key: "E",
      color: "#4ECDC4",
      sampleUrl: "/samples/clap.wav",
    },
    {
      id: 3,
      name: "Hi-Hat C",
      key: "R",
      color: "#FFE66D",
      sampleUrl: "/samples/hihat-closed.wav",
    },

    {
      id: 4,
      name: "Tom 1",
      key: "A",
      color: "#A8E6CF",
      sampleUrl: "/samples/tom1.wav",
    },
    {
      id: 5,
      name: "Tom 2",
      key: "S",
      color: "#FF8B94",
      sampleUrl: "/samples/tom2.wav",
    },
    {
      id: 6,
      name: "Tom 3",
      key: "D",
      color: "#B4A7D6",
      sampleUrl: "/samples/tom3.wav",
    },
    {
      id: 7,
      name: "Hi-Hat O",
      key: "F",
      color: "#FFD3B6",
      sampleUrl: "/samples/hihat-open.wav",
    },

    {
      id: 8,
      name: "Crash",
      key: "Z",
      color: "#FFAAA5",
      sampleUrl: "/samples/crash.wav",
    },
    {
      id: 9,
      name: "Ride",
      key: "X",
      color: "#A8DADC",
      sampleUrl: "/samples/ride.wav",
    },
    {
      id: 10,
      name: "Perc 1",
      key: "C",
      color: "#E0BBE4",
      sampleUrl: "/samples/perc1.wav",
    },
    {
      id: 11,
      name: "Perc 2",
      key: "V",
      color: "#FFDFD3",
      sampleUrl: "/samples/perc2.wav",
    },

    {
      id: 12,
      name: "Shaker",
      key: "1",
      color: "#F7B5CA",
      sampleUrl: "/samples/shaker.wav",
    },
    {
      id: 13,
      name: "Cowbell",
      key: "2",
      color: "#C1E7E3",
      sampleUrl: "/samples/cowbell.wav",
    },
    {
      id: 14,
      name: "Bass",
      key: "3",
      color: "#D4A5A5",
      sampleUrl: "/samples/bass.wav",
    },
    {
      id: 15,
      name: "FX",
      key: "4",
      color: "#9FA8DA",
      sampleUrl: "/samples/fx.wav",
    },
  ];

  // Initialize Audio Context and load samples
  useEffect(() => {
    audioContextRef.current = new (
      window.AudioContext || window.webkitAudioContext
    )();

    // Load default samples (using oscillators as fallback for demo)
    drumPads.forEach((pad) => {
      loadSample(pad.id, pad.sampleUrl);
    });

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Load audio sample
  const loadSample = async (padId, url) => {
    try {
      // For demo purposes, create synthetic sounds using oscillators
      // In production, you'd load actual audio files
      buffersRef.current[padId] = { type: "synth", padId };
    } catch (error) {
      console.error(`Failed to load sample for pad ${padId}:`, error);
    }
  };

  // Play sound function
  const playSound = useCallback(
    (padId, velocity = 1) => {
      if (!audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const pad = drumPads.find((p) => p.id === padId);
      if (!pad) return;

      // Create synthetic drum sounds
      const now = ctx.currentTime;

      // Different synthesis based on drum type
      if (pad.name.includes("Kick")) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);

        gain.gain.setValueAtTime(velocity, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      } else if (pad.name.includes("Snare") || pad.name.includes("Clap")) {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(
          1,
          ctx.sampleRate * 0.3,
          ctx.sampleRate,
        );
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1000;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(velocity * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.2);
      } else if (pad.name.includes("Hi-Hat")) {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(
          1,
          ctx.sampleRate * 0.1,
          ctx.sampleRate,
        );
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = pad.name.includes("C") ? 7000 : 5000;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(velocity * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          now + (pad.name.includes("C") ? 0.05 : 0.15),
        );

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.15);
      } else if (pad.name.includes("Tom")) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = pad.id === 4 ? 200 : pad.id === 5 ? 150 : 100;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.3);

        gain.gain.setValueAtTime(velocity * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // Default oscillator for other sounds
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.value = 440 + padId * 50;
        gain.gain.setValueAtTime(velocity * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
      }

      // Visual feedback
      setActivePads((prev) => new Set(prev).add(padId));
      setTimeout(() => {
        setActivePads((prev) => {
          const newSet = new Set(prev);
          newSet.delete(padId);
          return newSet;
        });
      }, 100);
    },
    [drumPads],
  );

  // Handle pad click
  const handlePadClick = useCallback(
    (padId) => {
      playSound(padId);

      if (isRecording) {
        setPattern((prev) => {
          const newPattern = [...prev];
          if (!newPattern[currentStep]) {
            newPattern[currentStep] = {};
          }
          newPattern[currentStep][padId] = true;
          return newPattern;
        });
      }
    },
    [playSound, isRecording, currentStep],
  );

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      const pad = drumPads.find((p) => p.key === e.key.toUpperCase());
      if (pad && !e.repeat) {
        handlePadClick(pad.id);
      }

      // Spacebar to play/pause
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drumPads, handlePadClick]);

  // Sequencer playback
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = ((60 / bpm) * 1000) / 4; // 16th notes

      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % 16;

          // Play sounds for this step
          const padsToPlay = pattern[nextStep];
          if (padsToPlay) {
            Object.keys(padsToPlay).forEach((padId) => {
              playSound(parseInt(padId));
            });
          }

          return nextStep;
        });
      }, stepDuration);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying, bpm, pattern, playSound]);

  // Toggle step in pattern
  const toggleStep = (step, padId) => {
    setPattern((prev) => {
      const newPattern = [...prev];
      if (!newPattern[step]) {
        newPattern[step] = {};
      }
      if (newPattern[step][padId]) {
        delete newPattern[step][padId];
      } else {
        newPattern[step][padId] = true;
      }
      return newPattern;
    });
  };

  // Clear pattern
  const clearPattern = () => {
    setPattern(
      Array(16)
        .fill(null)
        .map(() => ({})),
    );
    setCurrentStep(0);
    setIsPlaying(false);
    setIsRecording(false);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Instrument+Serif:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-[#0A0A0A] text-white"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Header */}
        <header className="border-b border-[#222222] bg-[#0F0F0F] px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B70F6] to-[#9D7DFF] flex items-center justify-center">
                <Volume2 size={20} className="text-white" />
              </div>
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Instrument Serif, serif" }}
              >
                BeatPad Studio
              </h1>
            </div>

            <button className="p-2 rounded-xl hover:bg-[#1A1A1A] transition-colors">
              <Settings size={20} className="text-[#999999]" />
            </button>
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Transport Controls */}
          <div className="mb-8 bg-[#111111] rounded-2xl p-6 border border-[#222222]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Playback controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-[#8B70F6] hover:bg-[#7A5FE5]"
                      : "bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333]"
                  }`}
                >
                  {isPlaying ? (
                    <Square size={20} fill="white" />
                  ) : (
                    <Play size={20} fill="white" className="ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-[#FF4444] hover:bg-[#EE3333]"
                      : "bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333]"
                  }`}
                >
                  <Circle size={20} fill={isRecording ? "white" : "none"} />
                </button>

                <button
                  onClick={clearPattern}
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] transition-all"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              {/* BPM Control */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#999999] font-medium">
                  TEMPO
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBpm(Math.max(60, bpm - 5))}
                    className="w-8 h-8 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-lg font-semibold"
                  >
                    −
                  </button>
                  <div
                    className="text-3xl font-bold w-24 text-center"
                    style={{ fontFamily: "Instrument Serif, serif" }}
                  >
                    {bpm}
                  </div>
                  <button
                    onClick={() => setBpm(Math.min(200, bpm + 5))}
                    className="w-8 h-8 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-lg font-semibold"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-[#999999] font-medium">BPM</span>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-3">
                {isRecording && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-xl">
                    <div
                      className="w-2 h-2 rounded-full bg-[#FF4444]"
                      style={{
                        animation:
                          "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      }}
                    />
                    <span className="text-sm font-medium text-[#FF4444]">
                      Recording
                    </span>
                  </div>
                )}
                {isPlaying && !isRecording && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#8B70F6]/10 border border-[#8B70F6]/30 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-[#8B70F6]" />
                    <span className="text-sm font-medium text-[#8B70F6]">
                      Playing
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Drum Pads */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 text-[#CCCCCC]">
                Drum Pads
              </h2>
              <div className="grid grid-cols-4 gap-3 bg-[#111111] p-6 rounded-2xl border border-[#222222]">
                {drumPads.map((pad) => (
                  <button
                    key={pad.id}
                    onClick={() => handlePadClick(pad.id)}
                    className={`relative aspect-square rounded-xl transition-all duration-75 ${
                      activePads.has(pad.id) ? "scale-95" : "scale-100"
                    } hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
                    style={{
                      backgroundColor: activePads.has(pad.id)
                        ? pad.color
                        : "#1A1A1A",
                      border: `2px solid ${activePads.has(pad.id) ? pad.color : "#333333"}`,
                      boxShadow: activePads.has(pad.id)
                        ? `0 0 20px ${pad.color}80`
                        : "none",
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      <span
                        className={`text-xs font-bold mb-1 ${activePads.has(pad.id) ? "text-white" : "text-[#666666]"}`}
                      >
                        {pad.key}
                      </span>
                      <span
                        className={`text-[10px] font-medium text-center ${activePads.has(pad.id) ? "text-white" : "text-[#999999]"}`}
                      >
                        {pad.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Sequencer */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold mb-4 text-[#CCCCCC]">
                Step Sequencer
              </h2>
              <div className="bg-[#111111] p-4 rounded-2xl border border-[#222222] overflow-x-auto">
                <div className="min-w-[300px]">
                  {drumPads.slice(0, 8).map((pad) => (
                    <div key={pad.id} className="flex items-center gap-1 mb-2">
                      <div className="w-16 text-xs text-[#666666] truncate">
                        {pad.name}
                      </div>
                      <div className="flex gap-1 flex-1">
                        {Array(16)
                          .fill(0)
                          .map((_, step) => (
                            <button
                              key={step}
                              onClick={() => toggleStep(step, pad.id)}
                              className={`w-4 h-4 rounded transition-all ${
                                currentStep === step ? "ring-2 ring-white" : ""
                              }`}
                              style={{
                                backgroundColor: pattern[step]?.[pad.id]
                                  ? pad.color
                                  : step % 4 === 0
                                    ? "#252525"
                                    : "#1A1A1A",
                                border: `1px solid ${step % 4 === 0 ? "#444444" : "#333333"}`,
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-[#111111] rounded-2xl p-6 border border-[#222222]">
            <h3 className="text-sm font-semibold mb-3 text-[#CCCCCC]">
              Quick Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#999999]">
              <div>
                <span className="text-[#8B70F6] font-semibold">Click pads</span>{" "}
                or use keyboard keys to play sounds
              </div>
              <div>
                <span className="text-[#8B70F6] font-semibold">Spacebar</span>{" "}
                to play/pause sequence
              </div>
              <div>
                <span className="text-[#8B70F6] font-semibold">
                  Click steps
                </span>{" "}
                in sequencer to program beats
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    </>
  );
}
