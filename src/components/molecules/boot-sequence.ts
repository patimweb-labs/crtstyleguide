import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

/**
 * Patimwep BIOS Boot Sequence Component
 * 
 * A standalone molecule that simulates a retro terminal boot process.
 * Used as a dramatic entry effect for the style guide.
 */
@customElement('crt-boot-sequence')
export class CrtBootSequence extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      background: #000;
      color: var(--crt-primary, #8aff8a);
      font-family: var(--crt-font-family, 'VT323', monospace);
      z-index: 2147483647;
      padding: 40px;
      overflow: hidden;
      pointer-events: all;
    }

    .log {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 1.2rem;
    }

    .line {
      white-space: pre-wrap;
    }

    .highlight {
      color: #fff;
      font-weight: bold;
    }

    .cursor {
      display: inline-block;
      width: 1ch;
      height: 1.2em;
      background: currentColor;
      animation: blink 0.5s step-end infinite;
      vertical-align: sub;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }
  `;

  @state() private _lines: string[] = [];
  @state() private _complete = false;

  private _bootLogs = [
    "PATIMWEP BIOS v4.0.2 (C) 1984-2026 PATIMWEP TERMINALS",
    "PATRICIUS WEPPELMANUS SYSTEM FOUNDRY",
    "CPU: PAT-IM-WEP X1-ULTIMATE @ 4.77 MHz",
    "MEMORY TEST: 640KB OK (EXTENDED 16MB DETECTED)",
    "",
    "SEARCHING FOR BOOT SECTOR...",
    "HD0: CRT-STYLEGUIDE-PIP (40MB) - OK",
    "HD1: PERSONAL-ASSETS-VOL (250MB) - MOUNTED",
    "",
    "LOADING ATOMS... SUCCESS",
    "LOADING MOLECULES... SUCCESS",
    "LOADING ORGANISMS... SUCCESS",
    "",
    "ESTABLISHING NEURAL LINK TO THE 'WEP'...",
    "PAT-IM-WEP LINK ESTABLISHED.",
    "",
    "WELCOME, MR. WEPPELMANN",
    "LOGIN: PW_ADMIN",
    "PASSWORD: *********",
    "",
    "ACCESS GRANTED.",
    "SYNCING CRT BUFFER..."
  ];

  /** Call this to (re-)start the boot sequence. */
  public start() {
    this._lines = [];
    this._complete = false;
    this._runSequence();
  }

  private async _runSequence() {
    for (const log of this._bootLogs) {
      if (!this.isConnected) return;
      if (log === "") {
        this._lines = [...this._lines, ""];
        await new Promise(r => setTimeout(r, 150));
      } else {
        this._lines = [...this._lines, log];
        await new Promise(r => setTimeout(r, 40 + Math.random() * 150));
      }
      this.requestUpdate();
    }
    
    await new Promise(r => setTimeout(r, 1200));
    this._complete = true;
    this.dispatchEvent(new CustomEvent('complete'));
  }

  render() {
    if (this._complete) return html``;

    return html`
      <div class="log">
        ${this._lines.map(line => html`<div class="line">${line}</div>`)}
        <div class="cursor"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'crt-boot-sequence': CrtBootSequence;
  }
}
