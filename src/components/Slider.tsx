import '../embla.css';
import { memo, useCallback, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
    IoChevronBack,
    IoChevronForward,
    IoHeart,
    IoHeartOutline,
    IoPause,
    IoPlay,
    IoSparkles,
} from 'react-icons/io5';
import type { Radio } from '../schema/RadiosSchema';
import { useRadioStore } from '../stores/useRadioStore';
import { formatName } from '../utils/formatname';
import { getStationLogo } from '../utils/stationLogo';

type SliderProps = {
    slides?: Radio[];
};

interface SlideCardProps {
    radio: Radio;
    index: number;
    isSelected: boolean;
    isThisPlaying: boolean;
    isFavorite: boolean;
    onSelect: (radio: Radio) => void;
    onToggleFavorite: (stationuuid: string) => void;
}

const SlideCard = memo(function SlideCard({
    radio,
    index,
    isSelected,
    isThisPlaying,
    isFavorite,
    onSelect,
    onToggleFavorite,
}: SlideCardProps) {
    const [failedUrl, setFailedUrl] = useState<string | null>(null);

    const resolvedLogo = getStationLogo(radio.name, radio.favicon, index);
    const coverSrc = failedUrl === resolvedLogo ? getStationLogo('', undefined, index) : resolvedLogo;

    return (
        <div className="flex-[0_0_78%] sm:flex-[0_0_46%] md:flex-[0_0_31%] lg:flex-[0_0_24%] min-w-0 pr-3.5">
            <article
                onClick={() => onSelect(radio)}
                className={`group relative h-48 sm:h-52 rounded-2xl overflow-hidden border cursor-pointer select-none transition-[border-color,box-shadow] duration-200 ${
                    isSelected
                        ? 'border-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 hover:shadow-md'
                }`}
            >
                <img
                    src={coverSrc}
                    alt={radio.name}
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                        if (resolvedLogo && failedUrl !== resolvedLogo) {
                            setFailedUrl(resolvedLogo);
                        }
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/15" />

                {/* Top bar: Status / Country + Favorite Button */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {isThisPlaying ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            En vivo
                        </span>
                    ) : radio.countrycode ? (
                        <span className="px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-sm text-white/90 text-[10px] font-bold uppercase tracking-wider">
                            {radio.countrycode}
                        </span>
                    ) : (
                        <span />
                    )}

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
                        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer active:scale-90 ${
                            isFavorite
                                ? 'bg-rose-500/90 text-white shadow-sm'
                                : 'bg-black/40 text-white/85 hover:bg-black/65 hover:text-rose-300'
                        }`}
                    >
                        {isFavorite ? (
                            <IoHeart className="w-4 h-4" />
                        ) : (
                            <IoHeartOutline className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Bottom info + Play/Pause button */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                        <h3
                            title={radio.name}
                            className="text-white font-bold text-sm sm:text-base truncate drop-shadow-sm"
                        >
                            {formatName(radio.name)}
                        </h3>
                        <p className="text-[11px] text-white/75 truncate mt-0.5">
                            {radio.tags
                                ? radio.tags
                                      .split(',')
                                      .slice(0, 2)
                                      .map((t) => `#${t.trim()}`)
                                      .join(' ')
                                : radio.country || 'Radio en vivo'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(radio);
                        }}
                        aria-label={
                            isThisPlaying ? `Pausar ${radio.name}` : `Reproducir ${radio.name}`
                        }
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
                            isThisPlaying
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/35'
                                : 'bg-white/90 text-slate-900 group-hover:bg-emerald-500 group-hover:text-white'
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
        </div>
    );
});

const Slider = ({ slides }: SliderProps) => {
    const radiosBackUp = useRadioStore((state) => state.radiosBackUp);
    const favoriteIds = useRadioStore((state) => state.favoriteIds);
    const activeStationId = useRadioStore((state) => state.radioplay?.stationuuid);
    const isPlaying = useRadioStore((state) => state.isPlaying);
    const toggleFavorite = useRadioStore((state) => state.toggleFavorite);

    const sourceRadios = slides && slides.length > 0 ? slides : radiosBackUp;

    const favoriteRadios = useMemo(() => {
        if (favoriteIds.length === 0 || sourceRadios.length === 0) return [];
        const byId = new Map(sourceRadios.map((radio) => [radio.stationuuid, radio]));
        return favoriteIds
            .map((id) => byId.get(id))
            .filter((radio): radio is Radio => Boolean(radio));
    }, [favoriteIds, sourceRadios]);

    const fallbackRadios = useMemo(() => {
        if (sourceRadios.length === 0) return [];
        return sourceRadios
            .slice()
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 12);
    }, [sourceRadios]);

    const showingFavorites = favoriteRadios.length > 0;
    const displaySlides = showingFavorites ? favoriteRadios : fallbackRadios;
    const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: displaySlides.length > 4,
        align: 'start',
        dragFree: true,
    });

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const handleSelectOrToggle = useCallback((radio: Radio) => {
        const { radioplay, isPlaying: playing, setPlaying, setRadioPlay } =
            useRadioStore.getState();
        if (radioplay?.stationuuid === radio.stationuuid) {
            setPlaying(!playing);
            return;
        }
        setRadioPlay(radio);
    }, []);

    return (
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 pb-2">
            {/* ── Header ── */}
            <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                    <div
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-1 ${
                            showingFavorites ? 'text-rose-500' : 'text-emerald-600'
                        }`}
                    >
                        {showingFavorites ? (
                            <IoHeart className="w-3.5 h-3.5" />
                        ) : (
                            <IoSparkles className="w-3.5 h-3.5" />
                        )}
                        <span>{showingFavorites ? 'Colección personal' : 'Destacadas'}</span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-neutral-100 tracking-tight">
                            {showingFavorites ? 'Tus favoritas' : 'Your Favorites'}
                        </h2>
                        {showingFavorites ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 tabular-nums">
                                {favoriteRadios.length}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400 dark:text-neutral-500">
                                Pulsa ♥ en cualquier radio para fijarla aquí
                            </span>
                        )}
                    </div>
                </div>

                {/* Carousel Controls */}
                {displaySlides.length > 1 && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label="Anterior en carrusel"
                            className="w-9 h-9 rounded-full border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                        >
                            <IoChevronBack className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label="Siguiente en carrusel"
                            className="w-9 h-9 rounded-full border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                        >
                            <IoChevronForward className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Slides or Skeleton ── */}
            {displaySlides.length === 0 ? (
                <div className="flex gap-3.5 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex-[0_0_78%] sm:flex-[0_0_46%] md:flex-[0_0_31%] lg:flex-[0_0_24%] h-48 sm:h-52 rounded-2xl bg-slate-100 dark:bg-neutral-900 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        {displaySlides.map((radio, index) => {
                            const isSelected = activeStationId === radio.stationuuid;
                            return (
                                <SlideCard
                                    key={radio.stationuuid}
                                    radio={radio}
                                    index={index}
                                    isSelected={isSelected}
                                    isThisPlaying={isSelected && isPlaying}
                                    isFavorite={favoriteSet.has(radio.stationuuid)}
                                    onSelect={handleSelectOrToggle}
                                    onToggleFavorite={toggleFavorite}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Slider;
