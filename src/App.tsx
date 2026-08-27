import { useState, type ReactNode } from "react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Check,
  Code2,
  Download,
  FileText,
  Github,
  HardDrive,
  Menu,
  Mic,
  Monitor,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

// Update only this line when publishing a new release.
const releaseVersion = "0.2.1";
const downloadUrl = `https://github.com/ruben-salas20/OpenCall.md/releases/download/v${releaseVersion}/OpenCall.md-Setup-${releaseVersion}.exe`;
const repositoryUrl = "https://github.com/ruben-salas20/OpenCall.md";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <m.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </m.div>
  );
}

type ScreenshotImageProps = {
  image: "dashboard" | "class-detail";
  alt: string;
  lazy?: boolean;
  fetchPriority?: "high" | "low";
};

function ScreenshotImage({ image, alt, lazy = false, fetchPriority }: ScreenshotImageProps) {
  const isDashboard = image === "dashboard";
  const width = isDashboard ? 1468 : 1470;
  const height = isDashboard ? 903 : 911;

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`/assets/${image}-640.webp 640w, /assets/${image}-768.webp 768w, /assets/${image}-1024.webp 1024w, /assets/${image}-${width}.webp ${width}w`}
        sizes="(max-width: 860px) 90vw, (max-width: 1320px) 54vw, 720px"
      />
      <img
        src={`/assets/${image}.png`}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        loading={lazy ? "lazy" : "eager"}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}

function Marker({ number }: { number: string }) {
  return (
    <div className="section-marker" aria-hidden="true">
      <span>{number}</span>
      <i />
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "brand--compact" : ""}`}>
      <span className="brand-mark">
        <img src="/assets/opencall-icon-dark.png" alt="" width={128} height={128} decoding="async" />
      </span>
      {!compact && (
        <span className="brand-name">
          OpenCall<span>.md</span>
        </span>
      )}
    </span>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="site-shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-nav">
        <div className="nav-inner">
          <a className="brand-link" href="#inicio" onClick={closeMenu} aria-label="OpenCall.md, inicio">
            <Logo />
          </a>

          <nav className="nav-links" aria-label="Navegación principal">
            <a href="#funciones">Cómo funciona</a>
            <a href="#privacidad">Privacidad</a>
            <a href="#descarga">Descarga</a>
          </nav>

          <div className="nav-actions">
            <a className="nav-github" href={repositoryUrl} target="_blank" rel="noreferrer">
              <Github size={16} aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a className="button button--small" href={downloadUrl}>
              Descargar
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

        <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
          <a href="#funciones" onClick={closeMenu}>Cómo funciona</a>
          <a href="#privacidad" onClick={closeMenu}>Privacidad</a>
          <a href="#descarga" onClick={closeMenu}>Descarga</a>
          <a href={repositoryUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>Ver código en GitHub</a>
        </div>
      </header>

      <main id="contenido">
        <section className="hero section-shell" id="inicio">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Una herramienta personal para tus clases
            </div>

            <h1>
              <span className="hero-accent">Graba tus clases.</span>
              <span>Transcribe en local.</span>
            </h1>

            <p className="hero-lede">
              Audio, pantalla y transcripción en tu equipo. Después, un resumen con el LLM que tú elijas.
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href={downloadUrl}>
                <Download size={17} aria-hidden="true" />
                Descargar
              </a>
              <a className="text-link" href="#funciones">
                Ver cómo funciona
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="hero-note">
              <span className="status-dot" />
              Transcripción local por defecto
            </div>
          </div>

          <figure className="hero-visual" aria-label="Capturas reales de OpenCall">
            <div className="visual-wash" />
            <div className="visual-grid" />

            <div className="screenshot screenshot--back">
              <div className="screenshot-bar">
                <span className="window-dots"><i /><i /><i /></span>
                <span>PANEL / CAPTURA LOCAL</span>
              </div>
              <ScreenshotImage image="dashboard" alt="Panel de OpenCall con permisos y clases recientes" fetchPriority="high" />
            </div>

            <div className="screenshot screenshot--front">
              <div className="screenshot-bar">
                <span className="window-dots"><i /><i /><i /></span>
                <span>CLASE / RESULTADO</span>
              </div>
              <ScreenshotImage image="class-detail" alt="Detalle de una clase con resumen, vídeo y transcripción" fetchPriority="low" />
            </div>

            <div className="visual-caption visual-caption--top">
              <Sparkles size={14} aria-hidden="true" />
              Del audio a los apuntes
            </div>
            <div className="visual-caption visual-caption--bottom">OpenCall.md / {releaseVersion}</div>
          </figure>
        </section>

        <section className="signal-strip" aria-label="Características principales">
          <div className="signal-inner section-shell">
            <p className="signal-lead">Pensado para volver a una clase y encontrar el hilo.</p>
            <div className="signal-item">
              <span className="signal-number">01</span>
              <strong>Local por defecto</strong>
              <span>Sin servidor para transcribir</span>
            </div>
            <div className="signal-item">
              <span className="signal-number">02</span>
              <strong>Sin suscripción obligatoria</strong>
              <span>Software libre bajo MIT</span>
            </div>
            <div className="signal-item">
              <span className="signal-number">03</span>
              <strong>Para clases largas</strong>
              <span>Hasta 4 horas por grabación</span>
            </div>
          </div>
        </section>

        <section className="process-section section-shell" id="funciones">
          <Reveal className="section-intro">
            <Marker number="01" />
            <h2>Una clase entra.<br /><em>Tus apuntes salen.</em></h2>
            <p>OpenCall guarda el contexto mientras ocurre la clase y lo ordena cuando termina.</p>
          </Reveal>

          <div className="process-list">
            <Reveal className="process-step" delay={0.05}>
              <span className="step-number">01</span>
              <div className="step-icon"><Monitor size={20} aria-hidden="true" /></div>
              <h3>Graba el contexto</h3>
              <p>Captura pantalla, micrófono y audio del sistema directamente en tu disco.</p>
            </Reveal>
            <Reveal className="process-step" delay={0.12}>
              <span className="step-number">02</span>
              <div className="step-icon"><AudioLines size={20} aria-hidden="true" /></div>
              <h3>Transcribe mientras pasa</h3>
              <p>Whisper corre dentro de la app y separa lo que dices tú de lo que dicen los demás.</p>
            </Reveal>
            <Reveal className="process-step" delay={0.19}>
              <span className="step-number">03</span>
              <div className="step-icon"><FileText size={20} aria-hidden="true" /></div>
              <h3>Vuelve a lo importante</h3>
              <p>Obtén resumen, puntos clave y acciones. Todo queda en tu historial local.</p>
            </Reveal>
          </div>
        </section>

        <section className="feature-section feature-section--capture section-shell">
          <Reveal className="feature-visual feature-visual--panel">
            <div className="feature-label">PANEL PRINCIPAL / 01</div>
            <div className="feature-image-frame">
              <ScreenshotImage image="dashboard" alt="Panel de OpenCall con captura local y clases recientes" lazy />
            </div>
          </Reveal>
          <Reveal className="feature-copy" delay={0.1}>
            <Marker number="02" />
            <h2>La clase sigue.<br /><em>Tú también.</em></h2>
            <p>Mientras explican, OpenCall conserva la pantalla y escucha los dos lados de la conversación.</p>
            <ul className="feature-points">
              <li><span><Monitor size={17} aria-hidden="true" /></span><strong>Pantalla y audio</strong><small>Para no perder el contexto visual ni la explicación.</small></li>
              <li><span><Mic size={17} aria-hidden="true" /></span><strong>Dos canales</strong><small>“Tú” y “ellos”, separados en la transcripción en vivo.</small></li>
              <li><span><Play size={17} aria-hidden="true" /></span><strong>Grabación independiente</strong><small>Si el resumen falla, la clase y el audio siguen guardados.</small></li>
            </ul>
          </Reveal>
        </section>

        <section className="feature-section feature-section--results section-shell">
          <Reveal className="feature-copy feature-copy--results">
            <Marker number="03" />
            <h2>No son solo<br /><em>palabras guardadas.</em></h2>
            <p>Al detener la grabación, la sesión se convierte en una ficha que puedes leer, buscar y volver a resumir.</p>
            <div className="result-list">
              <div><Check size={16} aria-hidden="true" /><span>Resumen narrativo de la clase</span></div>
              <div><Check size={16} aria-hidden="true" /><span>Puntos clave agrupados por tema</span></div>
              <div><Check size={16} aria-hidden="true" /><span>Tareas y preguntas pendientes</span></div>
              <div><Check size={16} aria-hidden="true" /><span>Archivos Markdown para tus herramientas</span></div>
            </div>
          </Reveal>
          <Reveal className="feature-visual feature-visual--detail" delay={0.1}>
            <div className="feature-label">DETALLE DE CLASE / 02</div>
            <div className="feature-image-frame">
              <ScreenshotImage image="class-detail" alt="Detalle de una clase con análisis, vídeo y transcripción" lazy />
            </div>
          </Reveal>
        </section>

        <section className="live-section">
          <div className="section-shell live-inner">
            <Reveal className="live-heading">
              <Marker number="04" />
              <h2>Si la clase pide<br /><em>atención, te avisa.</em></h2>
              <p>El copiloto en vivo lee el contexto de la conversación y propone el siguiente paso, sin ocupar el centro de la pantalla.</p>
            </Reveal>

            <div className="live-content">
              <Reveal className="prompt-column" delay={0.08}>
                <div className="prompt-block prompt-block--orange">
                  <span>DI ESTO</span>
                  <p>Una sugerencia concreta para seguir la conversación.</p>
                </div>
                <div className="prompt-block prompt-block--blue">
                  <span>PREGUNTA ESTO</span>
                  <p>Una pregunta para aclarar, profundizar o no perder el hilo.</p>
                </div>
              </Reveal>
              <Reveal className="live-detail" delay={0.15}>
                <div className="live-detail-line"><span className="live-dot" /> Asistente en vivo</div>
                <p>También puede señalar un ritmo demasiado alto, un monólogo largo o la falta de preguntas.</p>
                <div className="live-metrics">
                  <div><strong>Yo</strong><span className="metric-bar metric-bar--orange"><i /></span></div>
                  <div><strong>Ellos</strong><span className="metric-bar metric-bar--blue"><i /></span></div>
                </div>
                <span className="live-footnote">Métricas de conversación en tiempo real</span>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="privacy-section section-shell" id="privacidad">
          <Reveal className="privacy-copy">
            <Marker number="05" />
            <h2>La nube no<br /><em>es un requisito.</em></h2>
            <p>El motivo del fork es sencillo: que puedas grabar y transcribir una clase sin entregar el audio a una plataforma.</p>
          </Reveal>

          <Reveal className="privacy-ledger" delay={0.1}>
            <div className="ledger-row">
              <div className="ledger-icon"><HardDrive size={19} aria-hidden="true" /></div>
              <div><strong>Por defecto, todo queda en tu equipo</strong><span>Audio, vídeo, transcripción y base de datos se guardan localmente.</span></div>
              <span className="ledger-mark"><Check size={15} aria-hidden="true" /></span>
            </div>
            <div className="ledger-row">
              <div className="ledger-icon"><ShieldCheck size={19} aria-hidden="true" /></div>
              <div><strong>Whisper corre dentro de la aplicación</strong><span>No necesitas instalar un servidor para transcribir tus clases.</span></div>
              <span className="ledger-mark"><Check size={15} aria-hidden="true" /></span>
            </div>
            <div className="ledger-row">
              <div className="ledger-icon"><Code2 size={19} aria-hidden="true" /></div>
              <div><strong>Tú decides qué proveedor usar</strong><span>Si configuras STT o LLM remoto, los datos necesarios salen hacia ese proveedor.</span></div>
              <span className="ledger-mark ledger-mark--open"><ArrowUpRight size={15} aria-hidden="true" /></span>
            </div>
            <p className="privacy-note">Con Ollama en local, el circuito de los resúmenes también se queda dentro de tu máquina.</p>
          </Reveal>
        </section>

        <section className="facts-section section-shell">
          <Reveal className="facts-heading">
            <Marker number="06" />
            <h2>Hecho para una<br /><em>clase real.</em></h2>
          </Reveal>
          <div className="facts-grid">
            <Reveal className="fact" delay={0.03}><strong>Windows 11</strong><span>La plataforma probada en uso real.</span></Reveal>
            <Reveal className="fact" delay={0.09}><strong>4 horas</strong><span>Límite de grabación por sesión. La pausa no cuenta.</span></Reveal>
            <Reveal className="fact" delay={0.15}><strong>~1 GB</strong><span>Descarga inicial del modelo Whisper, una sola vez.</span></Reveal>
            <Reveal className="fact" delay={0.21}><strong>Markdown</strong><span>Resumen, transcripción y métricas listos para leer.</span></Reveal>
          </div>
          <p className="facts-note">macOS y Linux compilan, pero todavía no están verificados en este fork.</p>
        </section>

        <section className="download-section section-shell" id="descarga">
          <div className="download-glow" />
          <Reveal className="download-copy">
            <Marker number="07" />
            <h2><span>La próxima clase</span><em>empieza aquí.</em></h2>
            <p>Descarga la versión publicada, prueba el flujo completo y decide dónde quieres que se quede tu información.</p>
            <div className="download-actions">
              <a className="button button--primary" href={downloadUrl}>
                <Download size={17} aria-hidden="true" />
                Descargar
              </a>
              <a className="button button--outline" href={repositoryUrl} target="_blank" rel="noreferrer">
                <Github size={17} aria-hidden="true" />
                Ver código
              </a>
            </div>
            <p className="download-meta">v{releaseVersion} · Windows 11 x64 probado · Licencia MIT</p>
          </Reveal>
          <Reveal className="download-aside" delay={0.12}>
            <div className="download-aside-mark"><Logo compact /></div>
            <p>Un fork hecho para mis clases. Publicado porque funciona.</p>
            <a href={repositoryUrl} target="_blank" rel="noreferrer">ruben-salas20 / OpenCall.md <ArrowUpRight size={14} aria-hidden="true" /></a>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <a className="brand-link" href="#inicio" aria-label="Volver al inicio">
          <Logo />
        </a>
        <p>Una herramienta local para no perder tus clases.</p>
        <div className="footer-links">
          <a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`${repositoryUrl}/issues`} target="_blank" rel="noreferrer">Issues</a>
          <a href={`${repositoryUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT</a>
        </div>
        <small>Fork independiente de call.md / VideoDB. No afiliado. Transcripción con sherpa-onnx (Apache-2.0).</small>
      </footer>
      </div>
    </LazyMotion>
  );
}
