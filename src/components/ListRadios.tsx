import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    IoHeart,
    IoHeartOutline,
    IoMusicalNotes,
    IoPause,
    IoPlay,
    IoRadio,
    IoRefresh,
    IoThumbsUpOutline,
} from "react-icons/io5";
import type { Radio } from "../schema/RadiosSchema";
import { useRadioStore } from "../stores/useRadioStore";
import { FetchApi } from "../utils/fetchapi";
import { formatName } from "../utils/formatname";
import { getStationLogo } from "../utils/stationLogo";

type SortMode = "votes" | "name";

const PAGE_SIZE = 24;
const nameCollator = new Intl.Collator("es", { sensitivity: "base" });

const EQ_BARS = [
    { delay: "0ms", duration: "480ms" },
    { delay: "140ms", duration: "600ms" },
    { delay: "60ms", duration: "520ms" },
];

const parseStationTags = (tags?: string, limit = 2) => {
    if (!tags) return [];
    return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, limit);
};

interface RadioCardProps {
    radio: Radio;
    index: number;
    isSelected: boolean;
    isThisPlaying: boolean;
    isFavorite: boolean;
    onSelect: (radio: Radio) => void;
    onToggleFavorite: (stationuuid: string) => void;
}

const RadioCard = memo(function RadioCard({
    radio,
    index,
    isSelected,
    isThisPlaying,
    isFavorite,
    onSelect,
    onToggleFavorite,
}: RadioCardProps) {
    // Local error state: if the resolved logo URL fails, fall back to deterministic generic
    const [failedUrl, setFailedUrl] = useState<string | null>(null);

    const resolvedLogo = getStationLogo(radio.name, radio.favicon, index);
    const coverSrc = failedUrl === resolvedLogo ? getStationLogo("", undefined, index) : resolvedLogo;

    const tags = parseStationTags(radio.tags, 2);

    return (
        <article
            onClick={() => onSelect(radio)}
            className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-[border-color,background-color,box-shadow] duration-150 cursor-pointer select-none ${
                isSelected
                    ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-500/50 shadow-sm shadow-emerald-500/10"
                    : "border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
            }`}
        >
            {/* Left: Artwork + Info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="relative shrink-0">
                    <img
                        src={coverSrc}
                        alt={radio.name}
                        loading="lazy"
                        decoding="async"
                        className={`w-14 h-14 object-cover rounded-xl border ${
                            isThisPlaying ? "border-emerald-400 shadow-sm" : "border-slate-100 dark:border-slate-800"
                        }`}
                        onError={() => {
                            if (resolvedLogo && failedUrl !== resolvedLogo) {
                                setFailedUrl(resolvedLogo);
                            }
                        }}
                    />

                    {isThisPlaying && (
                        <div
                            aria-hidden="true"
                            className="absolute -bottom-1 -right-1 bg-neutral-900 border border-white rounded-md px-1 py-0.5 flex items-end gap-[2px] h-4 shadow-sm"
                        >
                            {EQ_BARS.map((bar, barIdx) => (
                                <span
                                    key={barIdx}
                                    className="w-[2px] h-2.5 bg-emerald-400 rounded-full origin-bottom"
                                    style={{
                                        animation: `eq-bounce ${bar.duration} ease-in-out ${bar.delay} infinite alternate`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <h3
                            title={radio.name}
                            className={`text-sm sm:text-[15px] font-bold truncate ${
                                isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100"
                            }`}
                        >
                            {formatName(radio.name)}
                        </h3>
                        {isSelected && (
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                    </div>

                    {/* Country + Votes */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {radio.countrycode && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                                {radio.countrycode}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 tabular-nums">
                            <IoThumbsUpOutline className="w-3.5 h-3.5" />
                            {radio.votes.toLocaleString()}
                        </span>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-full capitalize truncate"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Favorite + Play / Pause Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(radio.stationuuid);
                    }}
                    aria-label={
                        isFavorite
                            ? `Quitar ${radio.name} de favoritos`
                            : `Guardar ${radio.name} en favoritos`
                    }
                    title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer active:scale-90 ${
                        isFavorite
                            ? "text-rose-500 bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25"
                            : "text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                    {isFavorite ? (
                        <IoHeart className="w-4 h-4" />
                    ) : (
                        <IoHeartOutline className="w-4 h-4" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(radio);
                    }}
                    aria-label={isThisPlaying ? `Pausar ${radio.name}` : `Reproducir ${radio.name}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer active:scale-95 ${
                        isThisPlaying
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : isSelected
                              ? "bg-slate-900 dark:bg-emerald-500/20 text-white dark:text-emerald-300 hover:bg-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-white"
                    }`}
                >
                    {isThisPlaying ? (
                        <IoPause className="w-4 h-4" />
                    ) : (
                        <IoPlay className="w-4 h-4 translate-x-[1px]" />
                    )}
                </button>
            </div>
        </article>
    );
});

const ListRadios = () => {
    const updateRadios = useRadioStore((state) => state.setRadios);
    const updateRadiosBackUp = useRadioStore((state) => state.setBackUp);
    const radioList = useRadioStore((state) => state.radios);
    const activeStationId = useRadioStore((state) => state.radioplay?.stationuuid);
    const isPlaying = useRadioStore((state) => state.isPlaying);
    const favoriteIds = useRadioStore((state) => state.favoriteIds);
    const toggleFavorite = useRadioStore((state) => state.toggleFavorite);
    const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [sortBy, setSortBy] = useState<SortMode>("votes");
    const [selectedTag, setSelectedTag] = useState<string>("all");
    const [limitState, setLimitState] = useState({ key: "", count: PAGE_SIZE });

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const loadRadios = useCallback(async () => {
        try {
            const resultRadios = await FetchApi();
            updateRadios(resultRadios);
            updateRadiosBackUp(resultRadios);
            setHasError(resultRadios.length === 0);
        } catch (error) {
            console.log("Error desde la api", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, [updateRadios, updateRadiosBackUp]);

    useEffect(() => {
        loadRadios();
    }, [loadRadios]);

    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        loadRadios();
    };

    // Stable callback so active/play state changes only re-render the affected cards
    const handleSelectOrToggleRadio = useCallback((radio: Radio) => {
        const { radioplay, isPlaying: playing, setPlaying, setRadioPlay } =
            useRadioStore.getState();
        if (radioplay?.stationuuid === radio.stationuuid) {
            setPlaying(!playing);
            return;
        }
        setRadioPlay(radio);
    }, []);

    const popularTags = useMemo(() => {
        const tagCounts = new Map<string, number>();
        for (const radio of radioList) {
            for (const tag of parseStationTags(radio.tags, 3)) {
                const normalized = tag.toLowerCase();
                tagCounts.set(normalized, (tagCounts.get(normalized) ?? 0) + 1);
            }
        }
        return Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([tag]) => tag);
    }, [radioList]);

    const activeTagFilter =
        selectedTag === "all" || popularTags.includes(selectedTag) ? selectedTag : "all";

    const sortedRadios = useMemo(() => {
        const filtered =
            activeTagFilter === "all"
                ? radioList.slice()
                : radioList.filter((radio) =>
                      parseStationTags(radio.tags, 5).some(
                          (t) => t.toLowerCase() === activeTagFilter
                      )
                  );

        return filtered.sort((a, b) =>
            sortBy === "votes"
                ? b.votes - a.votes
                : nameCollator.compare(a.name, b.name)
        );
    }, [radioList, activeTagFilter, sortBy]);

    const filterKey = `${radioList.length}:${radioList[0]?.stationuuid ?? ""}:${activeTagFilter}:${sortBy}`;
    const visibleLimit = limitState.key === filterKey ? limitState.count : PAGE_SIZE;
    const visibleRadios = sortedRadios.slice(0, visibleLimit);
    const hasMore = visibleLimit < sortedRadios.length;

    const handleShowMore = useCallback(() => {
        setLimitState((prev) => ({
            key: filterKey,
            count: (prev.key === filterKey ? prev.count : PAGE_SIZE) + PAGE_SIZE,
        }));
    }, [filterKey]);

    // Progressively reveal additional cards as user scrolls near the bottom
    useEffect(() => {
        const sentinel = loadMoreRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    handleShowMore();
                }
            },
            { rootMargin: "250px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, handleShowMore]);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
            {/* ── Header & Controls ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-1">
                        <IoRadio className="w-3.5 h-3.5" />
                        <span>Discovery</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Emisoras disponibles
                        </h2>
                        {!isLoading && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 tabular-nums">
                                {sortedRadios.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Sort Toggle */}
                <div className="inline-flex items-center self-start sm:self-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setSortBy("votes")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            sortBy === "votes"
                                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                    >
                        Más votadas
                    </button>
                    <button
                        type="button"
                        onClick={() => setSortBy("name")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            sortBy === "name"
                                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                    >
                        A – Z
                    </button>
                </div>
            </div>

            {/* ── Quick Genre/Tag Pills ── */}
            {!isLoading && popularTags.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setSelectedTag("all")}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            activeTagFilter === "all"
                                ? "bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-sm"
                                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800"
                        }`}
                    >
                        Todas
                    </button>
                    {popularTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() =>
                                setSelectedTag((prev) => (prev === tag ? "all" : tag))
                            }
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                                activeTagFilter === tag
                                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800"
                            }`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Loading Skeleton ── */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 animate-pulse"
                        >
                            <div className="flex items-center gap-3.5 flex-1">
                                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                        </div>
                    ))}
                </div>
            )}

            {/* ── Error State ── */}
            {!isLoading && hasError && radioList.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/15 text-rose-500 flex items-center justify-center mb-3">
                        <IoRadio className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        No pudimos cargar las emisoras
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                        Verifica tu conexión e intenta nuevamente en unos segundos.
                    </p>
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm shadow-emerald-500/20 transition-colors cursor-pointer"
                    >
                        <IoRefresh className="w-4 h-4" />
                        Reintentar
                    </button>
                </div>
            )}

            {/* ── Empty Filter / Search State ── */}
            {!isLoading && !hasError && sortedRadios.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                        <IoMusicalNotes className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        No hay emisoras que coincidan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Prueba con otra búsqueda o cambia el filtro seleccionado.
                    </p>
                    {activeTagFilter !== "all" && (
                        <button
                            type="button"
                            onClick={() => setSelectedTag("all")}
                            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Ver todas las emisoras
                        </button>
                    )}
                </div>
            )}

            {/* ── Station Cards Grid ── */}
            {!isLoading && visibleRadios.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                        {visibleRadios.map((radio, index) => {
                            const isSelected = activeStationId === radio.stationuuid;
                            return (
                                <RadioCard
                                    key={radio.stationuuid}
                                    radio={radio}
                                    index={index}
                                    isSelected={isSelected}
                                    isThisPlaying={isSelected && isPlaying}
                                    isFavorite={favoriteSet.has(radio.stationuuid)}
                                    onSelect={handleSelectOrToggleRadio}
                                    onToggleFavorite={toggleFavorite}
                                />
                            );
                        })}
                    </div>

                    {hasMore && (
                        <div ref={loadMoreRef} className="flex justify-center pt-6">
                            <button
                                type="button"
                                onClick={handleShowMore}
                                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-800 transition-colors cursor-pointer"
                            >
                                Mostrar más ({sortedRadios.length - visibleRadios.length} restantes)
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default ListRadios;
