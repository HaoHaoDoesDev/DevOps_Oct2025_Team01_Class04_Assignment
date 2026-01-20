"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import userRoutes from "@/config/user-routes";
import { useRouter } from "next/navigation";
import CardNav from "@/components/ui/nav-bar";
import { items } from "@/data/card-nav-items";

export default function LandingPage() {
  const router = useRouter();
  return (
    <main>
      <CardNav
        items={items}
        baseColor="#fff"
        menuColor="#13379c"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />
      <div className="flex flex-col max-w-8xl md:flex-row items-center px-8 md:px-16 pt-32 pb-16 min-h-[80vh] ">
        <section className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/assets/landing-page-icon.png"
            alt="Logo"
            width={450}
            height={450}
          />
        </section>
        <section className="w-full md:w-1/2 max-w-150">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 ">
            Secure storage for what matters most
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed mb-8">
            Built for privacy. Designed for simplicity
          </p>
          <div className="flex gap-5">
            <Button
              variant="default"
              size="lg"
              onClick={() => router.push(userRoutes.authentication)}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(userRoutes.documentation)}
            >
              Find Out More
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
