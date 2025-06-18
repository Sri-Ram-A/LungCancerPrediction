// src/components/EnvironmentalHazards.tsx
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useHealthStore } from "@/store";


export function EnvironmentalHazards({ props }: { props: string[]; }) {
  const { factors, setFactor } = useHealthStore();

  return (
    <Tabs defaultValue={props[0]}>
      <TabsList>
        {props.map((hazard) => (
          <TabsTrigger key={hazard} value={hazard}>
            {hazard}
          </TabsTrigger>
        ))}
      </TabsList>

      {props.map((hazard) => (
        <TabsContent key={hazard} value={hazard}>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-medium">Rate {hazard} from 1 to 7</h3>
            <p className="text-sm text-muted-foreground mb-4">Make sure to be honest to yourself!</p>

            <RadioGroup
              value={factors[hazard]?.toString() || "1"}
              onValueChange={(value) => setFactor(hazard, parseInt(value))}
              className="grid grid-cols-7 gap-4"
            >
              {[...Array(7)].map((_, i) => {
                const value = (i + 1).toString();
                const id = `radio-${hazard}-${value}`;

                return (
                  <div key={id} className="flex items-center justify-center m-1">
                    <RadioGroupItem value={value} id={id} className="border-gray-300 m-1" />
                    <Label htmlFor={id} className="font-medium">
                      {value}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </TabsContent>
      ))}
    </Tabs>

  );
}