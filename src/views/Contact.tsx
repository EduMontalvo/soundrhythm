import { useState } from "react";
import {
    IoCheckmark,
    IoCopyOutline,
    IoLogoGithub,
    IoMailOutline,
    IoPaperPlaneOutline,
    IoRadio,
} from "react-icons/io5";

// Actualiza este correo con tu email real cuando quieras recibir mensajes directos
const CONTACT_EMAIL = "contacto@soundrhythm.dev";
const GITHUB_REPO_URL = "https://github.com/EduMontalvo/soundrhythm";
const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues/new`;

type ContactTopic = "Sugerir emisora" | "Reportar error" | "Consulta / Feedback";

const TOPICS: ContactTopic[] = [
    "Sugerir emisora",
    "Reportar error",
    "Consulta / Feedback",
];

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState<ContactTopic>("Sugerir emisora");
    const [message, setMessage] = useState("");
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [submittedNotice, setSubmittedNotice] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopiedEmail(true);
            window.setTimeout(() => setCopiedEmail(false), 2500);
        } catch {
            // Clipboard API unavailable in restricted contexts
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedMessage) {
            setErrorMsg("Por favor completa tu nombre y el mensaje antes de enviar.");
            return;
        }

        setErrorMsg(null);
        const subject = `[SoundRhythm] ${topic} - ${trimmedName}`;
        const bodyLines = [
            `Nombre: ${trimmedName}`,
            email.trim() ? `Correo de respuesta: ${email.trim()}` : null,
            `Motivo: ${topic}`,
            "",
            trimmedMessage,
        ]
            .filter((line): line is string => line !== null)
            .join("\n");

        const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
        window.location.href = mailtoUrl;
        setSubmittedNotice(true);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* ── Header ── */}
            <div className="max-w-2xl mb-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Contacto
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-neutral-100 tracking-tight mt-1">
                    ¿Sugieres una radio o encontraste un fallo?
                </h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-neutral-400 mt-2.5 leading-relaxed">
                    SoundRhythm es un proyecto mantenido de forma independiente. Puedes escribirme
                    directamente o abrir un issue en GitHub sin intermediarios.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-6 items-start">
                {/* ── Left Column: Direct Channels ── */}
                <div className="space-y-4">
                    {/* Email Card */}
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <IoMailOutline className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                                    Correo directo
                                </p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-neutral-100 truncate">
                                    {CONTACT_EMAIL}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200/80 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                            >
                                {copiedEmail ? (
                                    <>
                                        <IoCheckmark className="w-4 h-4 text-emerald-600" />
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <IoCopyOutline className="w-4 h-4" />
                                        Copiar correo
                                    </>
                                )}
                            </button>
                            <a
                                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[SoundRhythm] Contacto")}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                            >
                                Abrir app de correo
                            </a>
                        </div>
                    </div>

                    {/* GitHub Card */}
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-neutral-800 text-white flex items-center justify-center shrink-0">
                                <IoLogoGithub className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                                    Código abierto
                                </p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-neutral-100 truncate">
                                    EduMontalvo / soundrhythm
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-3 leading-relaxed">
                            Ideal si quieres reportar un bug técnico o proponer una nueva
                            funcionalidad en el repositorio.
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <a
                                href={GITHUB_ISSUES_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-black text-xs font-semibold transition-colors"
                            >
                                Reportar un issue
                            </a>
                            <a
                                href={GITHUB_REPO_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200/80 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-semibold transition-colors"
                            >
                                Ver código
                            </a>
                        </div>
                    </div>

                    {/* Community Radio Tip */}
                    <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/30">
                        <div className="flex items-start gap-3">
                            <IoRadio className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                                    ¿Quieres añadir una radio pública?
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                    Las emisoras provienen del catálogo comunitario{" "}
                                    <a
                                        href="https://www.radio-browser.info/add"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                                    >
                                        Radio Browser
                                    </a>
                                    . Cualquier emisora válida registrada allí aparecerá
                                    automáticamente en la app.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Contact Form (mailto-backed, zero server needed) ── */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4"
                >
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-neutral-100">Envía un mensaje</h2>
                        <p className="text-xs text-slate-400 dark:text-neutral-500 mt-0.5">
                            Se abrirá un borrador prellenado en tu cliente de correo.
                        </p>
                    </div>

                    {/* Topic Pills */}
                    <div>
                        <span className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-2">
                            Motivo
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {TOPICS.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setTopic(item)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                                        topic === item
                                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                                            : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200/80 dark:hover:bg-neutral-700"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <label className="block">
                            <span className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1.5">
                                Nombre *
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800 text-sm text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </label>

                        <label className="block">
                            <span className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1.5">
                                Tu correo (opcional)
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800 text-sm text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1.5">
                            Mensaje *
                        </span>
                        <textarea
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={
                                topic === "Sugerir emisora"
                                    ? "Nombre de la emisora, ciudad y enlace del stream si lo tienes..."
                                    : "Cuéntame en qué te puedo ayudar..."
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800 text-sm text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                        />
                    </label>

                    {errorMsg && (
                        <p className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15 px-3 py-2 rounded-xl">
                            {errorMsg}
                        </p>
                    )}

                    {submittedNotice && (
                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 px-3 py-2 rounded-xl">
                            Listo: si no se abrió tu app de correo automáticamente, puedes copiar la
                            dirección{" "}
                            <span className="font-bold">{CONTACT_EMAIL}</span> desde la tarjeta de
                            la izquierda.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-sm font-bold transition-colors cursor-pointer active:scale-[0.99]"
                    >
                        <IoPaperPlaneOutline className="w-4 h-4" />
                        Preparar mensaje
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
