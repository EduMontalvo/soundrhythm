import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    IoDiceOutline,
    IoHeart,
    IoHeartOutline,
    IoPause,
    IoPlay,
    IoPlaySkipBack,
    IoPlaySkipForward,
    IoRadio,
    IoRefresh,
    IoVolumeHigh,
    IoVolumeLow,
    IoVolumeMedium,
    IoVolumeMute,
} from "react-icons/io5";
import type { Radio } from "../schema/RadiosSchema";
import { useRadioStore } from "../stores/useRadioStore";
import { formatName } from "../utils/formatname";
import { getStationLogo } from "../utils/stationLogo";

type StreamStatus = "idle" | "loading" | "playing" | "paused" | "error";

const EQ_BARS = [
    { delay: "0ms", duration: "480ms" },
    { delay: "160ms", duration: "620ms" },
    { delay: "80ms", duration: "540ms" },
    { delay: "220ms", duration: "440ms" },
];

const pickRandomStation = (list: Radio[], excludeId?: string): Radio | null => {
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];
    const candidates = excludeId ? list.filter((r) => r.stationuuid !== excludeId) : list;
    const pool = candidates.length > 0 ? candidates : list;
    return pool[Math.floor(Math.random() * pool.length)] ?? null;
};

const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const pickRadio = useRadioStore((state) => state.radioplay);
    const radios = useRadioStore((state) => state.radios);
    const radiosBackUp = useRadioStore((state) => state.radiosBackUp);
    const isPlaying = useRadioStore((state) => state.isPlaying);
    const setPlaying = useRadioStore((state) => state.setPlaying);
    const setRadioPlay = useRadioStore((state) => state.setRadioPlay);
    const removeUnavailableRadio = useRadioStore((state) => state.removeUnavailableRadio);
    const favoriteIds = useRadioStore((state) => state.favoriteIds);
    const toggleFavorite = useRadioStore((state) => state.toggleFavorite);
    const volume = useRadioStore((state) => state.volume);
    const setVolume = useRadioStore((state) => state.setVolume);

    const [muted, setMuted] = useState(false);
    const [failedCoverUrl, setFailedCoverUrl] = useState<string | null>(null);
    const [removedNotice, setRemovedNotice] = useState<string | null>(null);
    const [audioState, setAudioState] = useState<{ src: string; status: StreamStatus }>({
        src: "",
        status: "idle",
    });

    const stationList = radios.length > 0 ? radios : radiosBackUp;
    const currentSrc = pickRadio?.url_resolved ?? "";
    const hasStation = Boolean(currentSrc && pickRadio?.stationuuid);
    const isCurrentFavorite = hasStation && favoriteIds.includes(pickRadio.stationuuid);

    const effectiveStatus: StreamStatus = useMemo(() => {
        if (!hasStation) return "idle";
        if (audioState.src !== currentSrc) {
            return isPlaying ? "loading" : "paused";
        }
        return audioState.status;
    }, [hasStation, audioState, currentSrc, isPlaying]);

    // Sync volume and mute state to the audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
        audio.muted = muted;
    }, [volume, muted]);

    // Control play / pause when station or playing flag changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (hasStation && isPlaying) {
            audio.play().catch(() => {
                // Browser autoplay policy or interrupted load; handled via audio events
            });
        } else {
            audio.pause();
        }
    }, [hasStation, currentSrc, isPlaying]);

    const handleUnavailableStation = useCallback(
        (stationuuid: string, stationName: string) => {
            if (typeof navigator !== "undefined" && !navigator.onLine) {
                setAudioState({ src: currentSrc, status: "error" });
                return;
            }
            removeUnavailableRadio(stationuuid);
            setRemovedNotice(`"${formatName(stationName)}" no disponible · eliminada de la lista`);
        },
        [currentSrc, removeUnavailableRadio]
    );

    // Auto-clear notice after 4 seconds
    useEffect(() => {
        if (!removedNotice) return;
        const timer = window.setTimeout(() => setRemovedNotice(null), 4000);
        return () => window.clearTimeout(timer);
    }, [removedNotice]);

    // Remove stations that stay stuck connecting for > 10s
    useEffect(() => {
        if (!hasStation || !isPlaying || effectiveStatus !== "loading") return;
        const stationId = pickRadio.stationuuid;
        const stationName = pickRadio.name;

        const timeout = window.setTimeout(() => {
            handleUnavailableStation(stationId, stationName);
        }, 10000);

        return () => window.clearTimeout(timeout);
    }, [
        hasStation,
        isPlaying,
        effectiveStatus,
        pickRadio?.stationuuid,
        pickRadio?.name,
        handleUnavailableStation,
    ]);

    const currentIndex = hasStation
        ? stationList.findIndex((r) => r.stationuuid === pickRadio.stationuuid)
        : -1;

    const handlePlayPause = () => {
        if (!hasStation) {
            if (stationList.length > 0) {
                setRadioPlay(stationList[0]);
            }
            return;
        }
        if (effectiveStatus === "error" && audioRef.current) {
            audioRef.current.load();
            setPlaying(true);
            audioRef.current.play().catch(() => {});
            return;
        }
        setPlaying(!isPlaying);
    };

    const handleStepStation = (direction: -1 | 1) => {
        if (stationList.length === 0) return;
        if (currentIndex === -1) {
            setRadioPlay(stationList[0]);
            return;
        }
        const nextIndex = (currentIndex + direction + stationList.length) % stationList.length;
        setRadioPlay(stationList[nextIndex]);
    };

    const handlePlayRandomStation = () => {
        const randomStation = pickRandomStation(stationList, pickRadio?.stationuuid);
        if (randomStation) {
            setRadioPlay(randomStation);
        }
    };

    const handleToggleMute = () => {
        setMuted((prev) => !prev);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextVolume = Number(e.target.value);
        setVolume(nextVolume);
        if (nextVolume > 0 && muted) {
            setMuted(false);
        }
    };

    const handleRetryStream = () => {
        if (!audioRef.current || !hasStation) return;
        setAudioState({ src: currentSrc, status: "loading" });
        audioRef.current.load();
        setPlaying(true);
        audioRef.current.play().catch(() => {});
    };

    const coverSrc = hasStation
        ? getStationLogo(pickRadio.name, pickRadio.favicon, 0)
        : "";
    const showCover = Boolean(coverSrc && failedCoverUrl !== coverSrc);
    const volumePercent = muted ? 0 : Math.round(volume * 100);

    const parsedTags = pickRadio?.tags
        ? pickRadio.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .slice(0, 2)
        : [];

    const renderVolumeIcon = () => {
        if (muted || volume === 0) return <IoVolumeMute className="w-5 h-5 text-slate-400" />;
        if (volume < 0.35) return <IoVolumeLow className="w-5 h-5 text-slate-600" />;
        if (volume < 0.7) return <IoVolumeMedium className="w-5 h-5 text-slate-600" />;
        return <IoVolumeHigh className="w-5 h-5 text-slate-700" />;
    };

    const statusBadge = () => {
        switch (effectiveStatus) {
            case "playing":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        En vivo
                    </span>
                );
            case "loading":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        Conectando
                    </span>
                );
            case "error":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold tracking-wider uppercase">
                        Sin señal
                    </span>
                );
            case "paused":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold tracking-wider uppercase">
                        Pausado
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <aside
            id="music-player"
            aria-label="Reproductor de radio"
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(15,23,42,0.08)]"
        >
            {/* Top status hairline */}
            <div className="h-[2px] w-full bg-slate-100 overflow-hidden">
                {effectiveStatus === "playing" && (
                    <div className="h-full w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
                )}
                {effectiveStatus === "loading" && (
                    <div className="h-full w-1/3 bg-emerald-500 animate-pulse rounded-full" />
                )}
                {effectiveStatus === "error" && (
                    <div className="h-full w-full bg-rose-400" />
                )}
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5">
                {/* ── Left: Station Artwork & Metadata ── */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                        <div
                            className={`w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center border transition-all duration-300 ${
                                effectiveStatus === "playing"
                                    ? "border-emerald-400/60 shadow-md shadow-emerald-500/15"
                                    : "border-slate-200 bg-slate-100"
                            }`}
                        >
                            {hasStation && showCover ? (
                                <img
                                    src={coverSrc}
                                    alt={pickRadio.name}
                                    className="w-full h-full object-cover"
                                    onError={() => setFailedCoverUrl(coverSrc)}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
                                    <IoRadio
                                        className={`w-5 h-5 ${
                                            effectiveStatus === "playing"
                                                ? "text-emerald-400"
                                                : "text-neutral-400"
                                        }`}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Animated EQ overlay when actively playing */}
                        {effectiveStatus === "playing" && (
                            <div
                                aria-hidden="true"
                                className="absolute -bottom-1 -right-1 bg-neutral-900 border border-white/80 rounded-md px-1 py-0.5 flex items-end gap-[2px] h-4 shadow-sm"
                            >
                                {EQ_BARS.map((bar, idx) => (
                                    <span
                                        key={idx}
                                        className="w-[2px] h-2.5 bg-emerald-400 rounded-full origin-bottom"
                                        style={{
                                            animation: `eq-bounce ${bar.duration} ease-in-out ${bar.delay} infinite alternate`,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col min-w-0">
                        {hasStation ? (
                            <>
                                <div className="flex items-center gap-2 min-w-0">
                                    <h2
                                        title={pickRadio.name}
                                        className="font-bold text-sm text-slate-800 truncate"
                                    >
                                        {formatName(pickRadio.name)}
                                    </h2>
                                    <span className="hidden sm:inline-flex shrink-0">
                                        {statusBadge()}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => toggleFavorite(pickRadio.stationuuid)}
                                        aria-label={
                                            isCurrentFavorite
                                                ? "Quitar emisora de favoritos"
                                                : "Guardar emisora en favoritos"
                                        }
                                        title={
                                            isCurrentFavorite
                                                ? "Quitar de favoritos"
                                                : "Agregar a favoritos"
                                        }
                                        className={`shrink-0 p-1 rounded-full transition-colors cursor-pointer active:scale-90 ${
                                            isCurrentFavorite
                                                ? "text-rose-500 hover:bg-rose-50"
                                                : "text-slate-400 hover:text-rose-500 hover:bg-slate-100"
                                        }`}
                                    >
                                        {isCurrentFavorite ? (
                                            <IoHeart className="w-4 h-4" />
                                        ) : (
                                            <IoHeartOutline className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-1.5 mt-0.5 min-w-0 overflow-hidden">
                                    {pickRadio.countrycode && (
                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                            {pickRadio.countrycode}
                                        </span>
                                    )}
                                    {parsedTags.length > 0 ? (
                                        parsedTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] text-slate-400 capitalize truncate"
                                            >
                                                #{tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[11px] text-slate-400 truncate">
                                            {pickRadio.country || "Radio en línea"}
                                        </span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="font-semibold text-sm text-slate-700 truncate">
                                    {removedNotice ? "Emisora eliminada" : "Sin emisora seleccionada"}
                                </h2>
                                <p
                                    className={`text-xs truncate ${
                                        removedNotice ? "text-amber-600 font-medium" : "text-slate-400"
                                    }`}
                                >
                                    {removedNotice ?? "Elige una radio o presiona Play"}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Center: Transport Controls ── */}
                <div className="flex items-center justify-center gap-1 sm:gap-2.5">
                    <button
                        type="button"
                        onClick={handlePlayRandomStation}
                        disabled={stationList.length === 0}
                        aria-label="Elegir radio aleatoria"
                        title="Elegir radio aleatoria"
                        className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer active:scale-95"
                    >
                        <IoDiceOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStepStation(-1)}
                        disabled={stationList.length === 0}
                        aria-label="Emisora anterior"
                        title="Emisora anterior"
                        className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer active:scale-95"
                    >
                        <IoPlaySkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={handlePlayPause}
                        disabled={!hasStation && stationList.length === 0}
                        aria-label={
                            isPlaying ? "Pausar emisora" : "Reproducir emisora"
                        }
                        title={
                            isPlaying ? "Pausar" : hasStation ? "Reproducir" : "Iniciar primera emisora"
                        }
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
                            isPlaying
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                                : "bg-slate-900 hover:bg-emerald-500 text-white shadow-md shadow-slate-900/15"
                        }`}
                    >
                        {effectiveStatus === "loading" ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <IoPause className="w-5 h-5" />
                        ) : (
                            <IoPlay className="w-5 h-5 translate-x-[1px]" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStepStation(1)}
                        disabled={stationList.length === 0}
                        aria-label="Siguiente emisora"
                        title="Siguiente emisora"
                        className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer active:scale-95"
                    >
                        <IoPlaySkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {effectiveStatus === "error" && (
                        <button
                            type="button"
                            onClick={handleRetryStream}
                            aria-label="Reintentar conexión"
                            title="Reintentar conexión"
                            className="p-2 rounded-full text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                            <IoRefresh className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* ── Right: Volume Slider & Mute ── */}
                <div className="flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={handleToggleMute}
                        aria-label={muted ? "Activar sonido" : "Silenciar"}
                        title={muted ? "Activar sonido" : "Silenciar"}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
                    >
                        {renderVolumeIcon()}
                    </button>

                    <div className="hidden md:flex items-center gap-2 w-28 lg:w-32">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={muted ? 0 : volume}
                            onChange={handleVolumeChange}
                            aria-label="Volumen"
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-500"
                            style={{
                                background: `linear-gradient(to right, #10b981 ${volumePercent}%, #e2e8f0 ${volumePercent}%)`,
                            }}
                        />
                        <span className="text-[11px] font-mono font-semibold text-slate-400 w-8 text-right tabular-nums">
                            {volumePercent}%
                        </span>
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={currentSrc || undefined}
                onLoadStart={() => {
                    if (currentSrc) setAudioState({ src: currentSrc, status: "loading" });
                }}
                onWaiting={() => {
                    if (currentSrc) setAudioState({ src: currentSrc, status: "loading" });
                }}
                onCanPlay={() => {
                    if (currentSrc) {
                        setAudioState({
                            src: currentSrc,
                            status: isPlaying ? "playing" : "paused",
                        });
                    }
                }}
                onPlaying={() => {
                    setRemovedNotice(null);
                    if (currentSrc) setAudioState({ src: currentSrc, status: "playing" });
                }}
                onPause={() => {
                    if (currentSrc) setAudioState({ src: currentSrc, status: "paused" });
                }}
                onError={() => {
                    if (hasStation) {
                        handleUnavailableStation(pickRadio.stationuuid, pickRadio.name);
                    } else if (currentSrc) {
                        setAudioState({ src: currentSrc, status: "error" });
                    }
                }}
            />
        </aside>
    );
};

export default MusicPlayer;
