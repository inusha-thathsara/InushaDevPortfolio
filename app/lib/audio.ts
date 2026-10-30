// Lightweight procedural Web Audio API sound synthesizer
// Zero external audio files required, instant playback and 100% reliable.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private unlocked: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cyberpunk_os_sound");
      this.enabled = saved !== null ? saved === "true" : true;

      const unlock = () => {
        this.unlocked = true;
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };

      window.addEventListener("pointerdown", unlock, { once: true, passive: true });
      window.addEventListener("keydown", unlock, { once: true, passive: true });
      window.addEventListener("touchstart", unlock, { once: true, passive: true });
    }
  }

  private initCtx(): boolean {
    if (typeof window === "undefined") return false;
    if (!this.unlocked) return false;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          return false;
        }
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return !!this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("cyberpunk_os_sound", String(this.enabled));
    }
    if (this.enabled) {
      this.playBlip();
    }
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== "undefined") {
      localStorage.setItem("cyberpunk_os_sound", String(val));
    }
  }

  // Tactical click for buttons and keyboard typing
  public playClick(freq = 800) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // AudioContext policy suppression gracefully handled
    }
  }

  // Sci-fi interface blip for panel opening or tab changes
  public playBlip(freq = 1200) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  // Futuristic window open rising chord
  public playOpen() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [600, 900].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + idx * 0.05 + 0.1);

        gain.gain.setValueAtTime(0.04, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.1);
      });
    } catch {}
  }

  // Tactical warning tone
  public playAlert() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.setValueAtTime(320, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {}
  }

  // Power-on / Reboot chord
  public playReboot() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      [261.63, 329.63, 392.0, 523.25].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.05, this.ctx!.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.06);
        osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.3);
      });
    } catch {}
  }

  // Intense catastrophic glitch siren and digital static burst
  public playCatastrophicGlitch() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Sawtooth alarm sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);

      // Low bass sub-boom
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(90, this.ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.45);
      subGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start();
      sub.stop(this.ctx.currentTime + 0.45);
    } catch {}
  }

  // CRT power collapse electronic pop & vacuum discharge
  public playCRTShutdown() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. High-voltage flyback transformer collapse (pitch plunge)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(3200, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);

      // 2. Vacuum implosion sub-whoosh
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(85, now);
      sub.frequency.exponentialRampToValueAtTime(20, now + 0.35);

      subGain.gain.setValueAtTime(0.40, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.35);
    } catch {}
  }

  private crashTrackTimer: any = null;
  private crashAudioEl: HTMLAudioElement | null = null;
  private crashMasterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private crashActiveNodes: (AudioNode | { stop?: (t?: number) => void })[] = [];

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (!this.noiseBuffer) {
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return this.noiseBuffer;
  }

  // Windows XP-style "Critical Stop" error alert, looped continuously for the crash sequence.
  // Procedurally synthesized (no external audio files): two dissonant, glassy descending
  // chimes ("ding-dong") with inharmonic partials, repeated until stopCrashAdrenalineTrack().
  private playXPErrorChime(startTime: number, dest: AudioNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // [frequency, offset seconds] — two-note descending dissonant alert
    const notes: [number, number][] = [
      [740, 0.0],
      [554, 0.17],
    ];

    notes.forEach(([freq, offset]) => {
      const t = startTime + offset;
      // Fundamental + inharmonic partials give the metallic "system sound" timbre
      const partials: [number, number][] = [
        [1, 0.55],
        [2.01, 0.22],
        [2.76, 0.14],
        [4.1, 0.07],
      ];
      partials.forEach(([mult, amp]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * mult, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(amp, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.65);
        this.crashActiveNodes.push(osc);
      });
    });
  }

  private crashHitEls: HTMLAudioElement[] = [];

  // One-shot Windows XP error hit for the crash sequence. Hits are allowed to overlap;
  // `rate` speeds up playback so repeated calls can accelerate over time.
  public playCrashHit(rate = 1) {
    this.enabled = true;
    if (typeof window === "undefined") return;
    const fallback = () => {
      try {
        this.initCtx();
        if (!this.ctx) return;
        const g = this.ctx.createGain();
        g.gain.value = 0.6;
        g.connect(this.ctx.destination);
        this.playXPErrorChime(this.ctx.currentTime + 0.005, g);
      } catch {}
    };
    try {
      const el = new Audio("/sounds/erro.mp3");
      el.volume = 0.85;
      el.playbackRate = Math.min(4, Math.max(0.5, rate));
      this.crashHitEls.push(el);
      const cleanup = () => {
        this.crashHitEls = this.crashHitEls.filter((e) => e !== el);
      };
      el.addEventListener("ended", cleanup);
      el.addEventListener("error", () => {
        cleanup();
        fallback();
      });
      el.play().catch(() => {
        cleanup();
        fallback();
      });
    } catch {
      fallback();
    }
  }
  public startCrashAdrenalineTrack() {
    // Force audio enabled for critical emergency halt
    this.enabled = true;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cyberpunk_os_sound", "true");
        window.dispatchEvent(new CustomEvent("cyberpunk_sound_enabled"));
      } catch {}
    }

    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      this.stopCrashAdrenalineTrack(0);

      // Preferred: the real Windows XP error sound, looped continuously
      try {
        const el = new Audio("/sounds/erro.mp3");
        el.loop = true;
        el.volume = 0.9;
        this.crashAudioEl = el;
        el.play().catch(() => {
          // Autoplay blocked or file failed: fall back to synthesized chime loop
          if (this.crashAudioEl === el) {
            this.crashAudioEl = null;
            this.startSynthErrorLoop();
          }
        });
        el.addEventListener("error", () => {
          if (this.crashAudioEl === el) {
            this.crashAudioEl = null;
            this.startSynthErrorLoop();
          }
        });
        return;
      } catch {}

      this.startSynthErrorLoop();
    } catch {
      // AudioContext policy suppression gracefully handled
    }
  }

  private startSynthErrorLoop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      this.crashActiveNodes = [];

      this.crashMasterGain = ctx.createGain();
      this.crashMasterGain.gain.setValueAtTime(0.7, ctx.currentTime);
      this.crashMasterGain.connect(ctx.destination);

      const master = this.crashMasterGain;
      const loopMs = 900;

      const fire = () => {
        if (!this.ctx || !this.crashMasterGain) return;
        // Drop finished oscillators so the node list doesn't grow unbounded
        this.crashActiveNodes = [];
        this.playXPErrorChime(this.ctx.currentTime + 0.01, master);
      };

      fire();
      this.crashTrackTimer = setInterval(fire, loopMs);
    } catch {
      // AudioContext policy suppression gracefully handled
    }
  }

  // Stop crash track smoothly
  public stopCrashAdrenalineTrack(fadeMs = 150) {
    this.crashHitEls.forEach((el) => {
      try {
        el.pause();
      } catch {}
    });
    this.crashHitEls = [];

    if (this.crashAudioEl) {
      const el = this.crashAudioEl;
      this.crashAudioEl = null;
      const steps = 6;
      const startVol = el.volume;
      let i = 0;
      const fade = setInterval(() => {
        i++;
        el.volume = Math.max(0, startVol * (1 - i / steps));
        if (i >= steps) {
          clearInterval(fade);
          el.pause();
          el.currentTime = 0;
        }
      }, Math.max(10, fadeMs / steps));
    }

    if (this.crashTrackTimer) {
      clearInterval(this.crashTrackTimer);
      this.crashTrackTimer = null;
    }

    if (this.crashActiveNodes && this.crashActiveNodes.length > 0) {
      this.crashActiveNodes.forEach((node) => {
        try {
          if ("stop" in node && typeof node.stop === "function") {
            node.stop();
          }
        } catch {}
      });
      this.crashActiveNodes = [];
    }

    if (this.crashMasterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const fadeSec = Math.max(0.01, fadeMs / 1000);
        this.crashMasterGain.gain.setValueAtTime(this.crashMasterGain.gain.value, now);
        this.crashMasterGain.gain.linearRampToValueAtTime(0.001, now + fadeSec);
        const g = this.crashMasterGain;
        setTimeout(() => {
          try {
            g.disconnect();
          } catch {}
        }, fadeMs + 60);
        this.crashMasterGain = null;
      } catch {
        this.crashMasterGain = null;
      }
    }
  }
}

export const sound = new SoundEngine();
