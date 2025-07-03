"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PCBuilder() {
  const [selectedComponents, setSelectedComponents] = useState({});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-300">
            PC Builder Studio
          </h1>
          <p className="text-xl text-muted-foreground">
            Build your dream gaming PC with our advanced compatibility checker
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle>Component Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">Select CPU</Button>
                <Button className="w-full">Select GPU</Button>
                <Button className="w-full">Select Motherboard</Button>
                <Button className="w-full">Select Memory</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle>Build Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Cost</span>
                  <span className="font-bold text-yellow-300">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Components</span>
                  <span>0/8</span>
                </div>
                <Button className="w-full">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
