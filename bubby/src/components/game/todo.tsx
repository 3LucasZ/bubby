/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vKuYHiDCCTZ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function TodoList({
  items,
  index,
}: {
  items: string[];
  index: number;
}) {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Bubby's List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.length > 0 ? (
          items.map((item, i) => {
            if (i > index) return null; // Hide item

            return (
              <div key={i} className="flex items-center gap-4">
                <Checkbox checked={i < index} />
                <label>{item}</label>
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-4">
            <Checkbox className="" />
            <label>{"Adventure awaits! Click Bubby."}</label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
