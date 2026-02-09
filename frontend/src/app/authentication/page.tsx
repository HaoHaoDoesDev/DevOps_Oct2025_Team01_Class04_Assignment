"use client";

import { LoginForm } from "@/components/complex-ui/login-form";
import { items } from "@/data/card-nav-items";
import CardNav from "@/components/ui/nav-bar";

export default function Authentication() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-8xl mx-auto">
        <div className="hidden md:flex items-center justify-center">
          <section className="w-full md:w-1/2 max-w-150">
            <h1 className="text-4xl font-bold mb-2 text-zinc-900 ">
              Store smarter <br /> Keep everything safe
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed mb-8">
              A secure home for your photos and files
            </p>
          </section>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
