import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';

interface TermLine {
  text: string;
  type: 'prompt' | 'blank' | 'info' | 'read' | 'write' | 'done';
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
})
export class Terminal implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private timers: ReturnType<typeof setTimeout>[] = [];

  private readonly sequence: { line: TermLine; delay: number }[] = [
    { line: { text: '$ claude "add user onboarding flow"', type: 'prompt' }, delay: 800 },
    { line: { text: '', type: 'blank' }, delay: 500 },
    { line: { text: '  Exploring codebase...', type: 'info' }, delay: 700 },
    { line: { text: '', type: 'blank' }, delay: 100 },
    { line: { text: '  ✓ Read src/app/app.routes.ts', type: 'read' }, delay: 500 },
    { line: { text: '  ✓ Read src/app/app.config.ts', type: 'read' }, delay: 380 },
    { line: { text: '  ✓ Read src/app/auth/auth.service.ts', type: 'read' }, delay: 420 },
    { line: { text: '', type: 'blank' }, delay: 500 },
    { line: { text: "  I'll build a multi-step onboarding wizard.", type: 'info' }, delay: 900 },
    { line: { text: '', type: 'blank' }, delay: 200 },
    { line: { text: '  ✓ Write src/app/onboarding/onboarding.ts', type: 'write' }, delay: 650 },
    { line: { text: '  ✓ Write src/app/onboarding/onboarding.html', type: 'write' }, delay: 520 },
    { line: { text: '  ✓ Write src/app/onboarding/onboarding.scss', type: 'write' }, delay: 480 },
    { line: { text: '  ✓ Edit src/app/app.routes.ts', type: 'write' }, delay: 560 },
    { line: { text: '', type: 'blank' }, delay: 400 },
    { line: { text: '  Done  3 files created · 1 modified', type: 'done' }, delay: 300 },
  ];

  termLines = signal<TermLine[]>([]);
  termTyping = signal(false);

  ngOnInit() {
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));
    this.run(0);
  }

  private run(i: number) {
    if (i === 0) {
      this.termLines.set([]);
      this.termTyping.set(true);
    }
    const { line, delay } = this.sequence[i];
    const t = setTimeout(() => {
      this.termLines.update(lines => [...lines, line]);
      const next = i + 1;
      if (next < this.sequence.length) {
        this.run(next);
      } else {
        this.termTyping.set(false);
        this.timers.push(setTimeout(() => this.run(0), 4000));
      }
    }, delay);
    this.timers.push(t);
  }
}
