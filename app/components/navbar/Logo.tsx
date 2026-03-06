'use client';

import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push('/')}
            className="hidden md:block cursor-pointer font-bold text-rose-500 text-2xl"
        >
            Rentora
        </div>
    )
}

export default Logo;