// src/components/History.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BarRating } from "@/components/bar-rating";
import { HistoryIcon } from "lucide-react";
import { useHealthStore } from "@/store";
import Image from "next/image";
export function History({ props }: { props: string[] }) {
  const { factors, setFactor } = useHealthStore();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DrawerTrigger asChild>
          <div className="relative w-full h-full shadow-sm border rounded-xl border-blue-400 dark:border-orange-400 cursor-pointer hover:bg-gray-50 bg-white dark:bg-gray-800 transition-all overflow-hidden">
            <Image
              src="/abstract.jpg"
              alt="Historical Factors"
              fill
              className="object-cover"
              sizes="100vw" 
            />
          </div>

        </DrawerTrigger>
      </DrawerTrigger>

      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Health Factors History</DrawerTitle>
        </DrawerHeader>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-2xl px-4 pb-6 mx-auto"
        >
          <CarouselContent>
            {props.map((feature) => (
              <CarouselItem key={feature} className="sm:basis-1/2 md:basis-1/3">
                <div className="p-1">
                  <Card className="p-4">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg capitalize">
                        {feature.toLowerCase().replace(/-/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <BarRating
                        currentRating={factors[feature] || 1}
                        onChange={(value) => setFactor(feature, value)}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </DrawerContent>
    </Drawer>
  );
}