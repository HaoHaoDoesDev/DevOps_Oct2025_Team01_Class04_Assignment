"use client";

import { LoginForm } from "@/components/complex-ui/login-form"

export default function Authentication() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-black">
      <main className="flex min-h-screen w-full flex-col items-stretch justify-center bg-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-8xl mx-auto">
            
            <div className="flex items-center justify-center">
                
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
    </div>
  );
}