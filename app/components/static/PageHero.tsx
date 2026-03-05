interface PageHeroProps {
    badge: string;
    title: string;
    subtitle: string;
    gradient?: string; // Tailwind gradient classes
}

export default function PageHero({
    badge,
    title,
    subtitle,
    gradient = "from-rose-500 to-pink-600",
}: PageHeroProps) {
    return (
        <section className={`bg-gradient-to-br ${gradient} pt-32 pb-20 px-4`}>
            <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                    {badge}
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">{title}</h1>
                <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
            </div>
        </section>
    );
}
