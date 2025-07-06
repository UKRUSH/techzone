"use client";

import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Testimonials = memo(function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Gaming Enthusiast",
      content: "TechZone helped me build the perfect gaming rig. Their experts guided me through every step!",
      rating: 5,
      avatar: "AJ"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Content Creator", 
      content: "Lightning fast shipping and top quality components. My video editing workstation is a beast!",
      rating: 5,
      avatar: "SC"
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      role: "Developer",
      content: "Best customer service in the business. They really know their stuff and care about customers.",
      rating: 5,
      avatar: "MR"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-black/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of satisfied builders
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30 h-full">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-yellow-400 mb-4" />
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Testimonials;
