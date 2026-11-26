import { useState } from "react";
import { getStationLogo } from "../utils/stationLogo";
import { useRadioStore } from "../stores/useRadioStore";
import VolumeFader from "./VolumeFader";

// ── Vinyl SVG ─────────────────────────────────────────────────────────────────
function VinylDisc({
    spinning,
    coverUrl,
    stationName,
}: {
    spinning: boolean;
    coverUrl?: string;
    stationName?: string;
}) {
    const [imgErr, setImgErr] = useState(false);

    const hasValidCover = Boolean(coverUrl && !imgErr);

    return (
        <div
            className={`w-full h-full rounded-full ${spinning ? "vinyl-spinning" : "vinyl-paused"}`}
            style={{ transformOrigin: "center center" }}
        >
            <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="vg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#2d2d2d" />
                        <stop offset="45%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#0d0d0d" />
                    </radialGradient>
                    <radialGradient id="lg" cx="40%" cy="38%" r="62%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#065f46" />
                    </radialGradient>
                    <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4b5563" />
                        <stop offset="100%" stopColor="#1f2937" />
                    </radialGradient>
                    <filter id="ds">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.6" />
                    </filter>
                    <clipPath id="vinyl-cover-clip">
                        <circle cx="150" cy="150" r="62" />
                    </clipPath>
                </defs>

                {/* Vinyl body */}
                <circle cx="150" cy="150" r="148" fill="url(#vg)" filter="url(#ds)" />

                {/* Grooves */}
                {[138, 126, 114, 102, 92, 82, 73].map((r, i) => (
                    <circle
                        key={i}
                        cx="150"
                        cy="150"
                        r={r}
                        fill="none"
                        stroke="#333"
                        strokeWidth={i % 2 === 0 ? "0.9" : "0.5"}
                        opacity={0.55 - i * 0.05}
                    />
                ))}

                {/* Sheen */}
                {[130, 112, 96].map((r, i) => (
                    <circle
                        key={`sh${i}`}
                        cx="150"
                        cy="150"
                        r={r}
                        fill="none"
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="1"
                    />
                ))}

                {/* ── Center Label: Carátula de la estación o etiqueta verde por defecto ── */}
                {hasValidCover ? (
                    <>
                        {/* Fondo de respaldo para imágenes con transparencia */}
                        <circle cx="150" cy="150" r="62" fill="url(#lg)" />

                        {/* Carátula de la emisora recortada en círculo */}
                        <image
                            href={coverUrl}
                            x="88"
                            y="88"
                            width="124"
                            height="124"
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#vinyl-cover-clip)"
                            onError={() => setImgErr(true)}
                        />

                        {/* Sutil viñeta para integrar la carátula con el vinilo */}
                        <circle
                            cx="150"
                            cy="150"
                            r="62"
                            fill="black"
                            opacity="0.12"
                            clipPath="url(#vinyl-cover-clip)"
                        />
                        <circle
                            cx="150"
                            cy="150"
                            r="62"
                            fill="none"
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="1.2"
                        />
                        <circle
                            cx="150"
                            cy="150"
                            r="58"
                            fill="none"
                            stroke="rgba(0,0,0,0.35)"
                            strokeWidth="0.8"
                        />
                    </>
                ) : (
                    <>
                        <circle cx="150" cy="150" r="62" fill="url(#lg)" />
                        <circle
                            cx="150"
                            cy="150"
                            r="58"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                        <text
                            x="150"
                            y="138"
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.95)"
                            fontSize="9"
                            fontWeight="700"
                            fontFamily="Plus Jakarta Sans, sans-serif"
                            letterSpacing="2.5"
                        >
                            {stationName ? stationName.slice(0, 14).toUpperCase() : "SOUNDRHYTHM"}
                        </text>
                        <text
                            x="150"
                            y="151"
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.5)"
                            fontSize="6"
                            fontFamily="Plus Jakarta Sans, sans-serif"
                            letterSpacing="1"
                        >
                            RADIO
                        </text>
                        <text
                            x="150"
                            y="162"
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.35)"
                            fontSize="5"
                            fontFamily="Plus Jakarta Sans, sans-serif"
                        >
                            33⅓ RPM
                        </text>
                    </>
                )}

                {/* Spindle central del vinilo */}
                <circle cx="150" cy="150" r="7" fill="url(#cg)" />
                <circle cx="150" cy="150" r="3.5" fill="#111" />
                <circle cx="150" cy="150" r="1.2" fill="#555" />

                {/* Brillo especular */}
                <ellipse
                    cx="108"
                    cy="108"
                    rx="28"
                    ry="18"
                    fill="rgba(255,255,255,0.025)"
                    transform="rotate(-30,108,108)"
                />
            </svg>
        </div>
    );
}

// ── Tonearm SVG ───────────────────────────────────────────────────────────────
function Tonearm({ playing }: { playing: boolean }) {
    return (
        <div
            className={`absolute z-20 pointer-events-none ${playing ? "tonearm-playing" : "tonearm-paused"}`}
            style={{
                top: "0%",
                right: "0%",
                width: "52%",
                height: "80%",
                transformOrigin: "84% 7%",
            }}
        >
            <svg viewBox="0 0 160 240" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e2e2e2" />
                        <stop offset="50%" stopColor="#b8b8b8" />
                        <stop offset="100%" stopColor="#808080" />
                    </linearGradient>
                    <filter id="as">
                        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.45" />
                    </filter>
                </defs>

                {/* Pivot */}
                <circle cx="130" cy="18" r="13" fill="#c0c0c0" filter="url(#as)" />
                <circle cx="130" cy="18" r="9" fill="url(#ag)" />
                <circle cx="130" cy="18" r="4" fill="#888" />
                <circle cx="130" cy="18" r="2" fill="#555" />

                {/* Arm body */}
                <path
                    d="M125 27 Q102 78 76 138 L69 218"
                    fill="none"
                    stroke="url(#ag)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    filter="url(#as)"
                />
                <path
                    d="M123 29 Q100 80 74 140 L68 216"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* Headshell */}
                <path
                    d="M69 218 L50 230 L44 236"
                    fill="none"
                    stroke="url(#ag)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <rect x="31" y="226" width="21" height="10" rx="2" fill="url(#ag)" />

                {/* Needle */}
                <line x1="41" y1="236" x2="41" y2="244" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="41" cy="245" r="1.5" fill="#333" />

                {/* Counterweight */}
                <rect x="128" y="27" width="18" height="12" rx="3" fill="#aaa" />
                <rect x="130" y="29" width="14" height="8" rx="2" fill="#999" />
            </svg>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
const TurntablePlayer = () => {
    const isPlaying = useRadioStore((state) => state.isPlaying);
    const pickRadio = useRadioStore((state) => state.radioplay);
    const setPlaying = useRadioStore((state) => state.setPlaying);
    const setRadioPlay = useRadioStore((state) => state.setRadioPlay);
    const radioList = useRadioStore((state) => state.radios);
    const volume = useRadioStore((state) => state.volume);
    const setVolume = useRadioStore((state) => state.setVolume);

    const handleDiscClick = () => {
        if (pickRadio?.url_resolved || pickRadio?.stationuuid) {
            setPlaying(!isPlaying);
        } else if (radioList.length > 0) {
            setRadioPlay(radioList[0]);
        }
    };

    return (
        <div className="flex justify-center items-center py-6 md:py-10 px-3 sm:px-6">
            <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16 max-w-full">
                {/* Platter Container */}
                <div
                    className="relative shrink-0 w-[240px] h-[240px] sm:w-[290px] sm:h-[290px] md:w-[320px] md:h-[320px]"
                >
                    {/* Platter base */}
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: "10px",
                            background: "linear-gradient(145deg, #1f2937, #111827)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.04)",
                            border: "2px solid rgba(255,255,255,0.05)",
                        }}
                    />

                    {/* Vinyl - Clickable to toggle Play / Pause */}
                    <div
                        onClick={handleDiscClick}
                        role="button"
                        tabIndex={0}
                        aria-label={isPlaying ? "Pausar emisora" : "Reproducir emisora"}
                        title={isPlaying ? "Toca el disco para pausar" : "Toca el disco para reproducir"}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleDiscClick();
                            }
                        }}
                        className="absolute cursor-pointer rounded-full transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] select-none focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        style={{ inset: "14px" }}
                    >
                        <VinylDisc
                            key={pickRadio?.stationuuid ?? "idle"}
                            spinning={isPlaying}
                            coverUrl={pickRadio?.stationuuid ? getStationLogo(pickRadio.name, pickRadio.favicon, 0) : undefined}
                            stationName={pickRadio?.name}
                        />
                    </div>

                    {/* Tonearm */}
                    <Tonearm playing={isPlaying} />
                </div>

                {/* DJ Volume Fader beside the turntable */}
                <div className="shrink-0">
                    <VolumeFader volume={volume} onChange={setVolume} />
                </div>
            </div>
        </div>
    );
};

export default TurntablePlayer;
