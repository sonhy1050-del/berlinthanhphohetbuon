import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import contentData from '../data/contentData.json';
import { 
  Trophy, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Play, 
  Award,
  Flame,
  Gift
} from 'lucide-react';

// Extend window object for required callbacks
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

// Configurable constants from user brief
const WIN_SCORE = 20;
const GRAVITY = 0.38;
const JUMP_FORCE = -6.6;
const PIPE_SPEED = 2.2;
const PIPE_GAP = 175;
const PIPE_SPAWN_INTERVAL = 110; // in frame ticks (~1.8 seconds)
const VOUCHER_TEXT = "Voucher 2 lít xăng";
const BRAND_NAME = "VietinBank";
const GAME_TITLE = "Chờ vui – Chơi hay – Nhận quà liền tay";

interface FlappyVoucherGameProps {
  onBackToMenu: () => void;
}

export const FlappyVoucherGame: React.FC<FlappyVoucherGameProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game UI States: 'start' | 'playing' | 'win' | 'lose'
  const [gameState, setGameState] = useState<'start' | 'playing' | 'win' | 'lose'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [latestSavedVoucher, setLatestSavedVoucher] = useState<{ code: string; date: string } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Audio Context for optional subtle feedback beeps
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq: number, type: OscillatorType = 'sine', duration = 0.1) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay restrictions or errors ignored
    }
  };

  // Helper: Motivational text based on score
  const getMotivationalText = (currentScore: number) => {
    if (currentScore < 5) return 'Khởi động nhẹ nhàng!';
    if (currentScore <= 9) return 'Tốt lắm, tiếp tục nào!';
    if (currentScore <= 14) return 'Một nửa chặng đường rồi!';
    if (currentScore <= 19) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  // Generate voucher code VB-XXXXXX
  const generateVoucherCode = (): string => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomNum}`;
  };

  // Copy voucher
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Load high score and latest voucher from localStorage on mount
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem('vietinbank_flappy_highscore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
      const savedVoucher = localStorage.getItem('vietinbank_flappy_latest_voucher');
      if (savedVoucher) {
        setLatestSavedVoucher(JSON.parse(savedVoucher));
      }
    } catch {
      // localStorage may fail in restricted sandboxes
    }
  }, []);

  // Mutable Game Loop State
  const gameLoopRef = useRef<{
    animationFrameId: number | null;
    bird: {
      x: number;
      y: number;
      width: number;
      height: number;
      velocity: number;
      rotation: number;
    };
    pipes: Array<{
      x: number;
      topHeight: number;
      bottomY: number;
      width: number;
      passed: boolean;
    }>;
    tick: number;
    currentScore: number;
    isOver: boolean;
  }>({
    animationFrameId: null,
    bird: { x: 80, y: 200, width: 38, height: 26, velocity: 0, rotation: 0 },
    pipes: [],
    tick: 0,
    currentScore: 0,
    isOver: false,
  });

  // Jump Action
  const jump = useCallback(() => {
    if (gameLoopRef.current.isOver) return;
    gameLoopRef.current.bird.velocity = JUMP_FORCE;
    playBeep(480, 'sine', 0.1);
  }, [isMuted]);

  // Win Game function
  const winGame = useCallback(() => {
    gameLoopRef.current.isOver = true;
    const newVoucher = generateVoucherCode();
    setVoucherCode(newVoucher);
    setGameState('win');
    playBeep(700, 'triangle', 0.4);

    // Save to localStorage
    const nowIso = new Date().toISOString();
    try {
      localStorage.setItem('vietinbank_flappy_highscore', '20');
      setHighScore(20);
      const voucherRecord = { code: newVoucher, date: nowIso };
      localStorage.setItem('vietinbank_flappy_latest_voucher', JSON.stringify(voucherRecord));
      setLatestSavedVoucher(voucherRecord);
    } catch {}

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#004990', '#DA251C', '#FFD700', '#ffffff'],
      });
    } catch {}

    // Callback
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newVoucher,
        reward: VOUCHER_TEXT,
        timestamp: nowIso,
      });
    }
  }, [isMuted]);

  // End Game / Lose function
  const endGame = useCallback((finalScore: number) => {
    gameLoopRef.current.isOver = true;
    setGameState('lose');
    playBeep(180, 'sawtooth', 0.25);

    // Update high score
    try {
      const currentHigh = parseInt(localStorage.getItem('vietinbank_flappy_highscore') || '0', 10);
      if (finalScore > currentHigh) {
        localStorage.setItem('vietinbank_flappy_highscore', finalScore.toString());
        setHighScore(finalScore);
      }
    } catch {}

    // Subtle vibration on supported mobile devices
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(100);
      } catch {}
    }

    // Callback
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [isMuted]);

  // Reset Game
  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    const height = canvas ? canvas.height : 480;
    gameLoopRef.current = {
      animationFrameId: null,
      bird: {
        x: 80,
        y: height / 2,
        width: 38,
        height: 26,
        velocity: 0,
        rotation: 0,
      },
      pipes: [],
      tick: 0,
      currentScore: 0,
      isOver: false,
    };
    setScore(0);
  }, []);

  // Start Game
  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
  }, [resetGame]);

  // Main Canvas Render & Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current.animationFrameId) {
        cancelAnimationFrame(gameLoopRef.current.animationFrameId);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI display
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    let loopActive = true;

    const render = () => {
      if (!loopActive) return;

      const state = gameLoopRef.current;
      state.tick += 1;

      // 1. Clear background
      ctx.clearRect(0, 0, W, H);

      // Sky gradient (VietinBank subtle airy cyan-blue)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#E0F2FE');
      skyGrad.addColorStop(0.7, '#F0F9FF');
      skyGrad.addColorStop(1, '#E2E8F0');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle decorative clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc((state.tick * 0.4) % (W + 100) - 50, 60, 24, 0, Math.PI * 2);
      ctx.arc((state.tick * 0.4) % (W + 100) - 30, 50, 32, 0, Math.PI * 2);
      ctx.arc((state.tick * 0.4) % (W + 100) - 5, 60, 22, 0, Math.PI * 2);
      ctx.fill();

      // 2. Spawn Pipes
      if (state.tick % PIPE_SPAWN_INTERVAL === 0) {
        const minHeight = 50;
        const maxHeight = H - PIPE_GAP - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        state.pipes.push({
          x: W,
          topHeight,
          bottomY: topHeight + PIPE_GAP,
          width: 54,
          passed: false,
        });
      }

      // 3. Update & Draw Pipes
      for (let i = state.pipes.length - 1; i >= 0; i--) {
        const pipe = state.pipes[i];
        pipe.x -= PIPE_SPEED;

        // Pipe Styling (VietinBank Deep Blue column with Red rim)
        // Top Pipe
        const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        pipeGrad.addColorStop(0, '#004990');
        pipeGrad.addColorStop(0.7, '#0066B3');
        pipeGrad.addColorStop(1, '#003366');

        ctx.fillStyle = pipeGrad;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // Top Pipe Cap
        ctx.fillStyle = '#DA251C';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 14, pipe.width + 6, 14);

        // Bottom Pipe
        ctx.fillStyle = pipeGrad;
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, H - pipe.bottomY);
        // Bottom Pipe Cap
        ctx.fillStyle = '#DA251C';
        ctx.fillRect(pipe.x - 3, pipe.bottomY, pipe.width + 6, 14);

        // Check if passed for score
        if (!pipe.passed && pipe.x + pipe.width < state.bird.x) {
          pipe.passed = true;
          state.currentScore += 1;
          setScore(state.currentScore);
          playBeep(520, 'sine', 0.12);

          // Check win score
          if (state.currentScore >= WIN_SCORE) {
            winGame();
            return;
          }
        }

        // Remove offscreen pipes
        if (pipe.x + pipe.width < -10) {
          state.pipes.splice(i, 1);
        }

        // Collision check
        const birdBox = {
          left: state.bird.x - state.bird.width / 2 + 4,
          right: state.bird.x + state.bird.width / 2 - 4,
          top: state.bird.y - state.bird.height / 2 + 4,
          bottom: state.bird.y + state.bird.height / 2 - 4,
        };

        const topPipeBox = {
          left: pipe.x,
          right: pipe.x + pipe.width,
          top: 0,
          bottom: pipe.topHeight,
        };

        const bottomPipeBox = {
          left: pipe.x,
          right: pipe.x + pipe.width,
          top: pipe.bottomY,
          bottom: H,
        };

        const collideTop =
          birdBox.right > topPipeBox.left &&
          birdBox.left < topPipeBox.right &&
          birdBox.top < topPipeBox.bottom;

        const collideBottom =
          birdBox.right > bottomPipeBox.left &&
          birdBox.left < bottomPipeBox.right &&
          birdBox.bottom > bottomPipeBox.top;

        if (collideTop || collideBottom) {
          endGame(state.currentScore);
          return;
        }
      }

      // 4. Update Bird physics
      state.bird.velocity += GRAVITY;
      state.bird.y += state.bird.velocity;
      state.bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.bird.velocity * 0.08));

      // Floor & Ceiling Collision
      if (state.bird.y + state.bird.height / 2 >= H - 10) {
        state.bird.y = H - 10 - state.bird.height / 2;
        endGame(state.currentScore);
        return;
      }
      if (state.bird.y - state.bird.height / 2 <= 0) {
        state.bird.y = state.bird.height / 2;
        state.bird.velocity = 0;
      }

      // 5. Draw Flying Mascot / Banking Card
      ctx.save();
      ctx.translate(state.bird.x, state.bird.y);
      ctx.rotate(state.bird.rotation);

      // Draw stylized VietinBank Flying Card
      const cardW = state.bird.width;
      const cardH = state.bird.height;
      const rad = 5;

      // Card Body (VietinBank Premium Blue)
      ctx.fillStyle = '#004990';
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, rad);
      ctx.fill();

      // Red Accent Stripe
      ctx.fillStyle = '#DA251C';
      ctx.fillRect(-cardW / 2, -cardH / 2 + 4, cardW, 4);

      // Gold Chip
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-cardW / 2 + 5, -cardH / 2 + 10, 8, 6);

      // Wing (Flapping effect)
      ctx.fillStyle = '#38BDF8';
      const wingOffset = Math.sin(state.tick * 0.35) * 6;
      ctx.beginPath();
      ctx.moveTo(-cardW / 2 + 10, 0);
      ctx.lineTo(-cardW / 2 - 4, -8 + wingOffset);
      ctx.lineTo(-cardW / 2 + 12, -2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // 6. Draw Ground
      ctx.fillStyle = '#004990';
      ctx.fillRect(0, H - 10, W, 10);
      ctx.fillStyle = '#DA251C';
      ctx.fillRect(0, H - 10, W, 2);

      // Next frame
      state.animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      loopActive = false;
      if (gameLoopRef.current.animationFrameId) {
        cancelAnimationFrame(gameLoopRef.current.animationFrameId);
      }
    };
  }, [gameState, jump, winGame, endGame]);

  // Global Keyboard listener for Spacebar to jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start' || gameState === 'lose') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, startGame]);

  return (
    <div 
      id="flappy-voucher-game"
      ref={containerRef}
      className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 select-none"
    >
      {/* Game Header Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#004990] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về màn hình chính</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#004990]" />}
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Kỷ lục: {highScore}/20</span>
          </div>
        </div>
      </div>

      {/* Main Game Screen Wrapper */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center">
        
        {/* Top Info & Score Bar */}
        <div className="w-full px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#004990] text-sm">
              {BRAND_NAME}
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-700">
              {GAME_TITLE}
            </span>
          </div>

          {/* Score & Dynamic Motivation */}
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-[#004990]">
              Điểm: <span className="text-base text-[#DA251C]">{score}</span> / {WIN_SCORE}
            </div>
            <div className="text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {getMotivationalText(score)}
            </div>
          </div>
        </div>

        {/* Progress Bar (0 to 20) */}
        <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#004990] to-[#DA251C] h-full transition-all duration-200"
            style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
          />
        </div>

        {/* Canvas Area with Touch Prevention */}
        <div 
          className="relative w-full h-[400px] sm:h-[480px] bg-sky-50 touch-none-select cursor-pointer overflow-hidden"
          onClick={() => {
            if (gameState === 'playing') jump();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            if (gameState === 'playing') jump();
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />

          {/* OVERLAY: START SCREEN */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004990] to-[#0066B3] text-white flex items-center justify-center shadow-md mb-4">
                <Gift className="w-8 h-8 text-amber-300" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                {GAME_TITLE}
              </h2>
              <p className="text-sm font-semibold text-[#DA251C] mb-1">
                Vượt qua 20 thử thách để nhận voucher 2 lít xăng
              </p>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                Chạm vào màn hình hoặc nhấn phím Space để điều khiển thẻ VietinBank bay qua các chướng ngại vật!
              </p>

              <button
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#004990] to-[#0066B3] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md hover:opacity-95 active:scale-98 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Bắt đầu chơi</span>
              </button>

              <span className="mt-4 text-[11px] text-slate-400 font-medium">
                Chạm màn hình hoặc nhấn Space để bay
              </span>

              {/* Display latest voucher if previously won */}
              {latestSavedVoucher && (
                <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs max-w-xs">
                  <span className="font-bold text-amber-900 block mb-0.5">Mã quà tặng gần nhất của bạn:</span>
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>{latestSavedVoucher.code}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyVoucherCode(latestSavedVoucher.code);
                      }}
                      className="p-1 hover:text-[#004990]"
                      title="Sao chép"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OVERLAY: WIN SCREEN */}
          {gameState === 'win' && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Trophy className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                Chúc mừng!
              </h3>
              <p className="text-sm font-semibold text-slate-700 max-w-md mb-4">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận {VOUCHER_TEXT}.
              </p>

              {/* Voucher Box */}
              <div className="w-full max-w-sm bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 mb-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  MÃ VOUCHER NHẬN QUÀ CỦA BẠN
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-widest font-mono text-[#004990] mb-2 select-all">
                  {voucherCode}
                </div>
                <div className="text-[11px] text-slate-600 leading-tight">
                  Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => copyVoucherCode(voucherCode)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                </button>
                <button
                  onClick={startGame}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#004990] text-white text-xs font-bold rounded-xl hover:bg-[#003870] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>
                <button
                  onClick={onBackToMenu}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <span>Về màn hình chính</span>
                </button>
              </div>
            </div>
          )}

          {/* OVERLAY: LOSE SCREEN */}
          {gameState === 'lose' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-[#DA251C] flex items-center justify-center">
                  <Flame className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Rất tiếc!
                  </h4>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    Bạn đã vượt qua <span className="text-[#DA251C] font-extrabold">{score}/20</span> thử thách
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Chỉ còn một chút nữa thôi, hãy thử lại nhé!
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={startGame}
                    className="w-full py-3 bg-[#004990] hover:bg-[#003870] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Chơi lại ngay</span>
                  </button>
                  <button
                    onClick={onBackToMenu}
                    className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Về màn hình chính
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="w-full px-6 py-2.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Chương trình tương tác tri ân khách hàng chờ giao dịch tại quầy VietinBank. Chúc Quý khách may mắn!
        </div>
      </div>
    </div>
  );
};
