import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';

interface TermLine {
  text: string;
  type: 'prompt' | 'blank' | 'info' | 'read' | 'write' | 'done';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // ── Typewriter ────────────────────────────────────────────────────────────
  private readonly phrases = [
    'to use.',
    'to recommend.',
    'to rely on.',
    'to bid with.',
    'to estimate with.',
    'to win jobs with.',
    'to trust on site.',
    'to onboard fast.',
    'to talk about.',
    'to believe in.',
    'to build with.',
    'to grow with.',
    'to come back to.',
    'to be proud of.',
  ];
  private index = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];

  displayed = signal('');

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));
    this.type();
  }

  // ── Typewriter internals ──────────────────────────────────────────────────
  private rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private typeDelay(char: string): number {
    if (char === ' ') return this.rand(80, 250);
    if ('.,'.includes(char)) return this.rand(100, 300);
    return this.rand(30, 180);
  }

  private type() {
    const phrase = this.phrases[this.index];
    let i = this.displayed().length;
    const tick = () => {
      i++;
      this.displayed.set(phrase.slice(0, i));
      if (i < phrase.length) {
        this.timers.push(setTimeout(tick, this.typeDelay(phrase[i])));
      } else {
        this.timers.push(setTimeout(() => this.erase(), this.rand(2000, 3000)));
      }
    };
    this.timers.push(setTimeout(tick, this.rand(150, 300)));
  }

  private eraseDelay(remaining: number): number {
    if (remaining === this.displayed().length) return this.rand(200, 400);
    if (Math.random() < 0.1) return this.rand(150, 400);
    return this.rand(20, 100);
  }

  private erase() {
    const total = this.displayed().length;
    const tick = () => {
      this.displayed.set(this.displayed().slice(0, -1));
      if (this.displayed().length > 0) {
        this.timers.push(setTimeout(tick, this.eraseDelay(total)));
      } else {
        this.index = (this.index + 1) % this.phrases.length;
        this.timers.push(setTimeout(() => this.type(), this.rand(150, 300)));
      }
    };
    this.timers.push(setTimeout(tick, this.rand(200, 400)));
  }

}

