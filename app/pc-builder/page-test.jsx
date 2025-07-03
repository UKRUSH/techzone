"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PCBuilder = () => {
  const [test, setTest] = useState("PC Builder is working!");

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-yellow-400">
            PC Builder Studio
          </h1>
          <p className="text-xl text-gray-300">
            {test}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-zinc-900 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300">Component Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
                  onClick={() => setTest("Button clicked!")}
                >
                  Test Button
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300">Build Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-white">
                  <span>Status</span>
                  <span className="font-bold text-yellow-300">Working</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PCBuilder;
