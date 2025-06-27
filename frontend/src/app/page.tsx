"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { Header } from "@/components/pages/Header";
import { EnvironmentalHazards } from "@/components/pages/EnvironmentalFactors";
import { DiscomfortSymptoms } from "@/components/pages/DiscomfortSymptoms";
import { History } from "@/components/pages/HistoricalFactors";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { useHealthStore } from "@/store";
import { BarRating } from "@/components/bar-rating";
import { RespiratorySymptoms } from "@/components/pages/RespiratorySymptoms"
import { addYears, differenceInYears, parseISO } from "date-fns";
export default function Content() {
  const [mounted, setMounted] = React.useState(false);
  const { factors, setFactor } = useHealthStore()
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(addYears(new Date(), -18));


  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) { return null; }

  const lifestyleHabits = ["Alcohol use", "Smoking", "Passive Smoker", "Balanced Diet", "Obesity"];
  const environmentalExposures = ["Air Pollution", "OccuPational Hazards", "Dust Allergy"];
  // const geneticFactors = ["Genetic Risk", "chronic Lung Disease"];
  //  gender taken from Header
  const respiratorySymptoms = ["Coughing of Blood", "Shortness of Breath", "Wheezing", "Dry Cough", "Snoring", "Frequent Cold"];
  const discomfortSymptoms = ["Chest Pain", "Swallowing Difficulty", "Fatigue", "Clubbing of Finger Nails", "Weight Loss"];

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    // Calculate age in years
    const age = differenceInYears(new Date(), date);
    // Update the store with the calculated age
    setFactor("Age", age);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <Header />
      <div className="flex flex-1 min-h-0 relative">
        {/* Left Side - Image with Glassmorphic Overlays */}
        <div className="w-1/2 relative flex items-center justify-center ">
          <Image
            src="/lungs.png"
            alt="lungs logo"
            width={1024}
            height={1024}
            className="object-contain max-h-full max-w-full rounded-3xl shadow-2xl"
          />
          {/* Glassmorphic Card 1 - Top Right for Genetic Risk*/}
          <Card className="absolute right-4 top-1/4 w-64 p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Genetic Risk</h3>
              <CardDescription>
                Rate from 1-7
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <BarRating
                currentRating={factors["Genetic Risk"] || 1}
                onChange={(value) => setFactor("Genetic Risk", value)}
              />
            </CardContent>
          </Card>
          {/* Glassmorphic Card 2 - Bottom Left for Chronic Lung Disease*/}
          <Card className="absolute left-8 bottom-1/4 w-64 p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Chronic Lung Disease</h3>
              <CardDescription>
                Rate from 1-7
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <BarRating
                currentRating={factors["chronic Lung Disease"] || 1}
                onChange={(value) => setFactor("chronic Lung Disease", value)}
              />
            </CardContent>
          </Card>
        </div>
        {/* Right Side - Dashboard Grid */}
        <div className="grid grid-cols-2 auto-rows-[minmax(0,_1fr)] gap-3 h-full overflow-hidden">
          {/* Discomfort causing Symptoms */}
          <Card className="col-span-1 row-span-1 flex flex-col p-4 overflow-hidden">
            <DiscomfortSymptoms props={discomfortSymptoms} />
          </Card>
          {/* Age */}
          <div className="col-span-1 row-span-3 flex flex-col">
            <h3 className="text-lg font-semibold mb-3">Enter Date of Birth</h3>
            <Calendar
              id="age-calendar"
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border-0 shadow-none w-full"
              captionLayout="dropdown"
              defaultMonth={selectedDate}
              required
            />
          </div>
          {/* Respiratory Symotoms */}
          <RespiratorySymptoms props={respiratorySymptoms} />
          {/* Environmental Hazards */}
          <Card className="col-span-1 row-span-2 flex flex-col p-4 overflow-hidden">
            <h3 className="text-lg font-semibold mb-3">Environmental Hazards</h3>
            <EnvironmentalHazards props={environmentalExposures} />
          </Card>
          {/* History */}
          <History props={lifestyleHabits} />
        </div>
      </div>

    </div>
  );
}