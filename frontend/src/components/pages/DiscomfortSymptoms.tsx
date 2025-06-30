// src/components/props.tsx
"use client";

import * as React from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthStore } from "@/store";

export function DiscomfortSymptoms({ props }: { props: string[]; }) {
  const { factors, setFactor } = useHealthStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full p-3 shadow-sm cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-orange-900/20 dark:to-orange-800/20 hover:shadow-md transition-all rounded-lg">
          <div className="w-full h-full p-3 shadow-sm cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-orange-900/20 dark:to-orange-800/20 hover:shadow-md transition-all rounded-lg">
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-blue-800 dark:text-orange-200 font-medium text-center">Symptoms causing Discomfort👆</p>
            </div>
          </div>
        </div>
      </DialogTrigger>


      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jot down your props</DialogTitle>
          <DialogDescription>
            Make sure to rate your props from 1 to 7.
          </DialogDescription>
        </DialogHeader>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          {props.map((symptom) => (
            <AccordionItem key={symptom} value={symptom}>
              <AccordionTrigger>{symptom}</AccordionTrigger>
              <AccordionContent>
                <Card key={symptom}>


                  <CardHeader>
                    <CardTitle>{symptom}</CardTitle>
                    <CardDescription>Rate from 1 to 7</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full px-3">
                      <Slider
                        value={[factors[symptom] || 1]}
                        onValueChange={(value) => setFactor(symptom, value[0])}
                        max={7}
                        min={1}
                        step={1}
                        className="mb-1"
                      />

                      <div className="flex w-full px-[6px]">
                        <div className="flex justify-between w-full mt-1">
                          {[...Array(7)].map((_, i) => (
                            <span
                              key={i}
                              className="flex-1 text-center text-xs text-gray-500"
                              style={{ width: `${100 / 7}%` }}
                            >
                              {i + 1}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}