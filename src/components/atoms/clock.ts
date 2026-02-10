import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * crt-clock
 * A retro digital clock component with a flickering colon and optional 12/24h format.
 */
@customElement('crt-clock')
export class CrtClock extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--crt-font-family, 'VT323', monospace);
      color: var(--crt-text-primary, #00ff00);
      font-size: var(--crt-font-size-lg, 1.5rem);
      text-shadow: var(--crt-glow, 0 0 5px rgba(0, 255, 0, 0.7));
      letter-spacing: 2px;
    }

    .clock-wrapper {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .colon {
      animation: blink 1s step-end infinite;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `;

  @property({ type: Boolean, attribute: 'hour12' })
  hour12 = false;

  @state()
  private _time = new Date();

  private _timerInterval?: number;

  connectedCallback() {
    super.connectedCallback();
    this._timerInterval = window.setInterval(() => {
      this._time = new Date();
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
    }
  }

  render() {
    const hours = this._time.getHours();
    const minutes = this._time.getMinutes();
    const seconds = this._time.getSeconds();

    const displayHours = this.hour12 ? (hours % 12 || 12).toString().padStart(2, '0') : hours.toString().padStart(2, '0');
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    const ampm = this.hour12 ? (hours >= 12 ? ' PM' : ' AM') : '';

    return html`
      <div class="clock-wrapper">
        <span>${displayHours}</span>
        <span class="colon">:</span>
        <span>${displayMinutes}</span>
        <span class="colon">:</span>
        <span>${displaySeconds}</span>
        ${ampm ? html`<span>${ampm}</span>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'crt-clock': CrtClock;
  }
}
