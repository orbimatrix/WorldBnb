import PageHero from "@/app/components/static/PageHero";
import ContactForm from "@/app/components/static/ContactForm";

const concernTypes = [
    "Safety Emergency",
    "Property Doesn't Match Listing",
    "Host Misconduct",
    "Guest Misconduct",
    "Fraudulent Listing",
    "Discrimination",
    "Privacy Violation",
    "Technical Issue",
    "Billing Dispute",
    "Other",
];

const quickLinks = [
    { icon: "🚨", label: "Safety Emergency", desc: "Immediate safety concerns", color: "border-red-200 bg-red-50" },
    { icon: "🔍", label: "Listing Issues", desc: "Property doesn't match photos", color: "border-amber-200 bg-amber-50" },
    { icon: "💳", label: "Billing Dispute", desc: "Unauthorized charges or refunds", color: "border-blue-200 bg-blue-50" },
    { icon: "🤝", label: "Host or Guest Issue", desc: "Misconduct or policy violations", color: "border-purple-200 bg-purple-50" },
];

export default function ReportConcernPage() {
    return (
        <>
            <PageHero
                badge="Report"
                title="Report a Concern"
                subtitle="We take every report seriously. Our Trust & Safety team reviews all submissions and responds within 24 hours."
                gradient="from-red-500 to-rose-600"
            />

            {/* Emergency banner */}
            <div className="bg-red-600 text-white py-3 text-center text-sm font-semibold">
                🆘 If you are in immediate danger, call your local emergency services (911, 999, 112) immediately.
            </div>

            {/* Quick category cards */}
            <section className="py-14 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-black text-gray-900 mb-6 text-center">What are you reporting?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((q) => (
                            <div key={q.label} className={`rounded-2xl border-2 ${q.color} p-5 hover:shadow-md transition-all cursor-pointer`}>
                                <div className="text-3xl mb-3">{q.icon}</div>
                                <div className="font-bold text-gray-900 text-sm mb-1">{q.label}</div>
                                <div className="text-gray-500 text-xs">{q.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Report Form */}
            <section className="py-16 bg-white">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Submit Your Report</h2>
                        <p className="text-gray-500 text-sm mb-8">
                            All reports are confidential. Provide as much detail as possible to help us resolve the issue quickly.
                        </p>
                        <ContactForm subjects={concernTypes} submitLabel="Submit Report" />
                    </div>
                </div>
            </section>

            {/* What happens next */}
            <section className="py-14 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-xl font-black text-gray-900 mb-8">What Happens After You Report?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { step: "1", icon: "📬", title: "Confirmation", desc: "You'll receive an email confirmation within minutes." },
                            { step: "2", icon: "🔍", title: "Investigation", desc: "Our team reviews your report within 24 hours." },
                            { step: "3", icon: "✅", title: "Resolution", desc: "We'll contact you with findings and next steps." },
                        ].map((s) => (
                            <div key={s.step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Step {s.step}</div>
                                <div className="font-bold text-gray-900 mb-2">{s.title}</div>
                                <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
