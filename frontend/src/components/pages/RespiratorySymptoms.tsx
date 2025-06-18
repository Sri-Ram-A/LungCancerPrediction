// src/components/props.tsx
"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHealthStore } from "@/store";

export function RespiratorySymptoms({ props }: { props: string[] }) {
    const { factors, setFactor } = useHealthStore();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="h-full cursor-pointer transition-all hover:shadow-md">
                    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                        <h3 className="text-lg font-medium text-center text-blue-800 dark:text-orange-200">
                            Respiratory Symptoms
                        </h3>
                    </div>
                </Card>
            </DialogTrigger>

            <DialogContent className="max-w-[90vw] sm:max-w-md">
                <DialogHeader className="px-4 sm:px-0">
                    <DialogTitle>Rate Your Symptoms</DialogTitle>
                    <DialogDescription className="text-balance">
                        Please rate each symptom from 1 (mild) to 7 (severe)
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-hidden px-2">
                    <Carousel className="w-full">
                        <CarouselContent className="pb-6">
                            {props.map((symptom) => (
                                <CarouselItem key={symptom} className="px-2">
                                    <div className="space-y-6 p-4">
                                        <h4 className="text-lg font-medium text-center capitalize">
                                            {symptom.toLowerCase()}
                                        </h4>
                                        <div className="space-y-4">
                                            <RadioGroup
                                                value={factors[symptom]?.toString() || "1"}
                                                onValueChange={(value) => setFactor(symptom, parseInt(value))}
                                                className="grid grid-cols-7 gap-2 px-1"
                                            >
                                                {[...Array(7)].map((_, i) => {
                                                    const value = (i + 1).toString();
                                                    const id = `radio-${symptom}-${value}`;
                                                    return (
                                                        <div key={id} className="flex flex-col items-center space-y-1">
                                                            <RadioGroupItem
                                                                value={value}
                                                                id={id}
                                                                className="h-6 w-6 border-2"
                                                            />
                                                            <Label htmlFor={id} className="text-xs">
                                                                {value}
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="absolute top-3 -translate-y-1/2 left-2 right-2 flex justify-between">
                            <CarouselPrevious className="static sm:absolute sm:left-0" />
                            <CarouselNext className="static sm:absolute sm:right-0" />
                        </div>
                    </Carousel>
                </div>
            </DialogContent>
        </Dialog>
    );
}