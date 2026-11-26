import { Link } from "react-router-dom";
import {
    IoArrowForward,
    IoCodeSlash,
    IoDiceOutline,
    IoDiscOutline,
    IoGlobeOutline,
    IoHeartOutline,
    IoLogoGithub,
    IoRadio,
    IoShieldCheckmarkOutline,
} from "react-icons/io5";

const FEATURES = [
    {
        icon: IoDiscOutline,
        title: "Tocadiscos & Fader DJ",
        description:
            "Vinilo giratorio con la carátula de cada emisora y fader táctil sincronizado en tiempo real con el reproductor.",
    },
    {
        icon: IoHeartOutline,
        title: "Favoritos en tu carrusel",
        description:
            "Guarda tus emisoras preferidas localmente en tu navegador para tenerlas siempre a la mano en la parte superior.",
    },
    {
        icon: IoDiceOutline,
        title: "Descubrimiento rápido",
        description:
            "Filtra por nombre o etiquetas musicales, ordena por votos y salta a una emisora aleatoria con un solo clic.",
    },
    {
        icon: IoShieldCheckmarkOutline,
        title: "Emisoras verificadas",
        description:
            "Descarta flujos incompatibles o caídos antes de mostrarse y elimina automáticamente las señales que dejan de responder.",
    },
];

const TECH_STACK = [
    "React 19",
    "TypeScript",
    "Tailwind CSS v4",
    "Zustand",
    "React Router",
    "Embla Carousel",
    "Axios",
    "Zod",
];

const GITHUB_REPO_URL = "https://github.com/EduMontalvo/soundrhythm";

const About = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
            {/* ── Intro Hero Card ── */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black dark:border dark:border-neutral-800 text-white p-7 sm:p-10 shadow-xl">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl"
                />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Sobre SoundRhythm
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                        Radio en vivo con{" "}
                        <span className="text-emerald-400">alma de vinilo</span>
                    </h1>

                    <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                        SoundRhythm nació como un proyecto independiente con una idea simple:
                        escuchar emisoras de radio en vivo de Perú desde una interfaz limpia,
                        rápida y sin distracciones, inspirada en una tornamesa clásica.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            <IoRadio className="w-4 h-4" />
                            Explorar emisoras
                        </Link>
                        <a
                            href={GITHUB_REPO_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold transition-colors"
                        >
                            <IoLogoGithub className="w-4 h-4" />
                            Ver repositorio
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Key Features ── */}
            <section>
                <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                        Experiencia
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-neutral-100 tracking-tight mt-0.5">
                        Pensado para disfrutar la radio
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FEATURES.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article
                                key={item.title}
                                className="p-5 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-500/30 dark:hover:border-emerald-500/40 hover:shadow-md transition-[border-color,box-shadow] duration-150"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-neutral-100">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                                    {item.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* ── Solo Creator + Stack & Credits ── */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900 flex flex-col justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
                            <IoCodeSlash className="w-4 h-4 text-emerald-500" />
                            Proyecto independiente
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                            Hecho por un solo desarrollador
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
                            Diseño, estado global, reproductor y optimización construidos paso a
                            paso como proyecto personal. Si encuentras algún detalle por mejorar o
                            quieres proponer una mejora, tu feedback es bienvenido.
                        </p>
                    </div>

                    <div className="mt-5">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                        >
                            Ir a contacto
                            <IoArrowForward className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
                            <IoGlobeOutline className="w-4 h-4 text-emerald-500" />
                            Tecnología & Datos abiertos
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                            Stack y fuente de emisoras
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {TECH_STACK.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 dark:text-neutral-500 mt-5 leading-relaxed">
                        Directorio de emisoras impulsado por la API abierta de{" "}
                        <a
                            href="https://www.radio-browser.info/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                            Radio Browser
                        </a>
                        .
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
