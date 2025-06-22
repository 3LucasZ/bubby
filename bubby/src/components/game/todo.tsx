import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import "./swing.css"; // <- Add this import for the custom animation

export default function TodoList({
  items,
  index,
}: {
  items: string[];
  index: number;
}) {
  return (
    <Card className="w-full max-w-lg mx-auto animate-swing origin-top [animation-duration:3s] [animation-iteration-count:infinite] [animation-timing-function:ease-in-out]">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Bubby's List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.length > 0 ? (
          items.map((item, i) => {
            if (i > index) return null;
            return (
              <div key={i} className="flex items-center gap-4">
                <Checkbox checked={i < index} />
                <label>{item}</label>
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-4">
            <Checkbox />
            <label>Adventure awaits! Click Bubby.</label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
