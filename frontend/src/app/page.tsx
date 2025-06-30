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
      <div className="flex flex-1 min-h-0 relative flex-col md:flex-row">
        {/* Left Side - Image with Glassmorphic Overlays */}
        <div className="w-full md:w-1/2 relative flex items-center justify-center py-6 md:py-0">
          <Image
            src="/lungs.png"
            alt="lungs logo"
            priority
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
        {/* Right Side - Masonry Dashboard Grid */}
        <div className="w-full md:w-1/2 px-2 py-6 md:py-10 flex flex-col items-stretch">
          <div className="columns-1 sm:columns-2 gap-6 space-y-6">
            {/* Discomfort Symptoms */}
            <Card className="mb-6 break-inside-avoid rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-6">
              <CardHeader className="mb-2">
                <h3 className="text-xl font-bold text-blue-700 dark:text-orange-400">Discomfort Symptoms</h3>
              </CardHeader>
              <CardContent>
                <DiscomfortSymptoms props={discomfortSymptoms} />
              </CardContent>
            </Card>
            {/* Date of Birth */}
            <Card className="mb-6 break-inside-avoid rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-6">
              <CardHeader className="mb-2">
                <h3 className="text-xl font-bold text-blue-700 dark:text-orange-400">Date of Birth</h3>
                <CardDescription className="text-gray-500 dark:text-gray-400">Select your birth date</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  id="age-calendar"
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border-0 shadow-none w-full"
                  captionLayout="dropdown"
                  defaultMonth={selectedDate}
                  required
                  classNames={{
                    dropdown: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md px-2 py-1 mx-1", 
                    
                  }}
                />
              </CardContent>
            </Card>
            {/* Respiratory Symptoms */}
            <Card className="mb-6 break-inside-avoid rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-6">
              <CardHeader className="mb-2">
                <h3 className="text-xl font-bold text-blue-700 dark:text-orange-400">Respiratory Symptoms</h3>
              </CardHeader>
              <CardContent>
                <RespiratorySymptoms props={respiratorySymptoms} />
              </CardContent>
            </Card>
            {/* Environmental Hazards */}
            <Card className="mb-6 break-inside-avoid rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-6">
              <CardHeader className="mb-2">
                <h3 className="text-xl font-bold text-blue-700 dark:text-orange-400">Environmental Hazards</h3>
              </CardHeader>
              <CardContent>
                <EnvironmentalHazards props={environmentalExposures} />
              </CardContent>
            </Card>
            {/* Lifestyle & History */}
            <Card className="mb-6 break-inside-avoid rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-6">
              <CardHeader className="mb-2">
                <h3 className="text-xl font-bold text-blue-700 dark:text-orange-400">Lifestyle & History</h3>
              </CardHeader>
              <CardContent>
                <History props={lifestyleHabits} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}