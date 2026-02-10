/**
 * CRT Living Style Guide - Main Application
 * Built with Lit Components using Atomic Design
 */

// Import styles FIRST
import '../src/styles/index.css';
import './style.css';

// Import components directly to ensure registration
import '../src/components/atoms/button';
import '../src/components/atoms/badge';
import '../src/components/atoms/typography';
import '../src/components/atoms/tabs';
import '../src/components/atoms/input';
import '../src/components/atoms/icon';
import '../src/components/atoms/link';
import '../src/components/atoms/clock';
import '../src/components/atoms/search';
import '../src/components/atoms/file-upload';
import '../src/components/atoms/file-input';
import '../src/components/atoms/calendar';
import '../src/components/atoms/select';
import '../src/components/atoms/checkbox-radio';
import '../src/components/atoms/progress';
import '../src/components/atoms/tooltip';
import '../src/components/atoms/breadcrumb';
import '../src/components/atoms/pagination';
import '../src/components/atoms/slider';
import '../src/components/atoms/toggle';
import '../src/components/atoms/avatar';
import '../src/components/atoms/alert';
import '../src/components/atoms/spinner';
import '../src/components/molecules/card';
import '../src/components/molecules/table';
import '../src/components/molecules/grid';
import '../src/components/molecules/code-example';
import '../src/components/molecules/modal';
import '../src/components/molecules/toast';
import '../src/components/molecules/accordion';
import '../src/components/molecules/visualizer';
import '../src/components/molecules/playlist';
import '../src/components/molecules/music-player';
import '../src/components/molecules/terminal';
import '../src/components/molecules/navbar';
import '../src/components/molecules/header';
import '../src/components/molecules/footer';
import '../src/components/molecules/crt-overlay';
import '../src/components/molecules/boot-sequence';
import '../src/components/molecules/log';
import '../src/components/organisms/music-station';

// Import and render template
import { render } from 'lit';
import { styleGuideTemplate } from './template';
import { categories, componentDocs } from './data/components';

// Wait for custom elements to be defined, then render
customElements.whenDefined('crt-button').then(() => {
  console.log('✅ Components loaded, rendering style guide...');
  
  const root = document.getElementById('app');
  if (root) {
    render(styleGuideTemplate(), root);

    // IntersectionObserver for active sidebar links
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.sg-sidebar a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, observerOptions);

    // Observe all sections and components
    document.querySelectorAll('.sg-section, .sg-component').forEach(el => observer.observe(el));

    // Smooth scroll for sidebar links
    document.querySelectorAll('.sg-sidebar a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', href);
          }
        }
        
        // Close sidebar on mobile after click
        if (window.innerWidth <= 1024) {
          document.body.classList.remove('sidebar-open');
        }
      });
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('sg-mobile-menu');
    if (mobileMenu) {
      mobileMenu.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open');
      });
    }

    // Back to Top functionality
    const backToTop = document.getElementById('sg-back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Also ensure body/html scroll (some browsers prefer one or the other)
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });

      // Show/hide button on scroll
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTop.style.display = 'block';
        } else {
          backToTop.style.display = 'none';
        }
      }, { passive: true });
    }

    // Attach a demo async fetcher to the search demo (simulated server)
    setTimeout(() => {
      const data = [
        { value: 'patimwep', label: 'Patimwep - Verrostete Terminals' },
        { value: 'retro', label: 'Retro Beats' },
        { value: 'synth', label: 'Synthwave' },
        { value: 'chiptune', label: 'Chiptune Classics' },
        { value: 'ambient', label: 'Ambient Textures' }
      ];

      const sections = categories.map((category) => ({
        value: `#${category.id}`,
        label: category.label,
        href: `#${category.id}`,
      }));

      const components = componentDocs.map((component) => ({
        value: component.name.toLowerCase(),
        label: `${component.name} (${component.tag})`,
        href: `#${component.id}`,
      }));

      const suggestions = [...sections, ...components, ...data];

      // Attach fetcher to all search instances in the styleguide (header + demo)
      const searches = Array.from(document.querySelectorAll('crt-search')) as any[];
      for (const sEl of searches) {
        // Avoid overwriting an existing fetcher
        if (!sEl.fetcher) {
          sEl.fetcher = async (q: string) => {
            await new Promise((r) => setTimeout(r, 200));
            const s = (q || '').toLowerCase();
            return suggestions.filter((item: any) => (item.label || item.value).toLowerCase().includes(s)).slice(0, 50);
          };
        }

        sEl.addEventListener('select', (e: any) => {
          const item = e.detail?.item;
          console.log('Search select:', e.detail);
          // Navigate to href if present
          if (item?.href) {
            const target = document.querySelector(item.href) as HTMLElement | null;
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              try { history.replaceState(null, '', item.href); } catch (err) { location.hash = item.href; }
            }
          }

          const toast = document.querySelector('crt-toast') as any;
          toast?.show?.({ message: `Selected: ${e.detail.label || e.detail.value}`, variant: 'success' });
        });
      }
      
      // Wire CRT power switch demo (if present in template)
      const powerSwitch = document.getElementById('crt-power-switch') as HTMLInputElement | null;
      if (powerSwitch) {
        const sync = () => document.documentElement.classList.toggle('sg-authentic', powerSwitch.checked);
        powerSwitch.addEventListener('change', sync);
        // initialize state
        sync();
      }

      // Global CRT Overlay functionality
      const globalOverlay = document.getElementById('global-crt-overlay') as any;
      
      // Listen for overlay toggle from header
      document.addEventListener('overlay-toggle', (e: any) => {
        const active = e.detail.active;
        if (globalOverlay) {
          globalOverlay.active = active;
        }
      });

      // Synchronize FLICKER toggle with overlay properties
      document.addEventListener('change', (e: any) => {
        const target = e.target as HTMLElement;
        // Check for crt-toggle or the internal input if event is composed
        const toggle = target.closest('crt-toggle');
        if (toggle && toggle.getAttribute('label') === 'FLICKER') {
          const isFlickerActive = toggle.checked;
          console.log('Flicker toggle changed:', isFlickerActive);
          document.documentElement.classList.toggle('no-flicker', !isFlickerActive);
          if (globalOverlay) {
            globalOverlay.flicker = isFlickerActive;
            globalOverlay.scanlines = isFlickerActive;
            // Also force a re-render if needed, though Lit should handle it
            globalOverlay.requestUpdate();
          }
        }
      });

      // Listen for color changes (theme updates)
      document.addEventListener('color-change', (e: any) => {
        console.log('Theme changed to:', e.detail.color);
      });
    }, 50);
  }
});
