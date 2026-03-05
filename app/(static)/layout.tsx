import LandingHeader from "@/app/components/landing/LandingHeader";
import LandingFooter from "@/app/components/landing/LandingFooter";

export default function StaticLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LandingHeader />
            <main className="min-h-screen">{children}</main>
            <LandingFooter />
        </>
    );
}
