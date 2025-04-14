'use client';

import { Link } from '@/i18n/routing';
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center py-20 bg-background">
            <Image src="/assets/images/all-img/404-2.svg" alt="" height={300} width={300} />
            <div className="max-w-[546px] mx-auto w-full mt-12">
                <h4 className="text-default-900 mb-4">Page not found</h4>
                <div className="dark:text-white text-base font-normal mb-10">
                    The page you are looking for might have been removed had its name
                    changed or is temporarily unavailable.
                </div>
            </div>
            <div className="max-w-[300px] mx-auto w-full">
                <Link
                    href="/auth/login"
                    className="btn bg-white hover:bg-opacity-75 transition-all duration-150 block text-center"
                >
                    Go to homepage
                </Link>
            </div>
        </div>
    );
}