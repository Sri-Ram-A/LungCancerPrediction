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
      <TabsList className="grid w-full grid-flow-col gap-1 bg-transparent p-0 mb-4">
        {props.map((hazard) => (
          <TabsTrigger
            key={hazard}
            value={hazard}
            className="relative px-4 py-2 rounded-none font-medium transition-all duration-200
              border-b-2 border-transparent
              text-gray-600 hover:text-blue-700 
              dark:text-gray-400 dark:hover:text-orange-400
              data-[state=active]:text-blue-700 dark:data-[state=active]:text-orange-400
              data-[state=active]:border-blue-700 dark:data-[state=active]:border-orange-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-orange-400
              first:rounded-l-md last:rounded-r-md
              "
          >
            {hazard}
          </TabsTrigger>
        ))}
      </TabsList>

      {props.map((hazard) => (
        <TabsContent key={hazard} value={hazard}>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-medium text-blue-700 dark:text-orange-400">Rate {hazard} from 1 to 7</h3>
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