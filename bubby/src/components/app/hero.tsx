import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import React from "react";

const Hero07 = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12"
        )}
      />
      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
          A Child's Best Friend
        </h1>
        <p className="mt-6 text-[17px] md:text-lg">
          Bubby is a cute bear that will help calm the anxiety of young
          children.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <>
            {/* <Button size="lg" className="rounded-full text-base">
              Get Started <ArrowUpRight className="!h-5 !w-5" />
            </Button> */}
            <a href="https://www.youtube.com/watch?v=1CnfRK3ScTI">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base shadow-none flex"
              >
                <CirclePlay className="!h-5 !w-5" /> Watch Demo
              </Button>
            </a>
          </>
          <>
            {/* <Button>
              <a href="/soul-reader">Soul Reader</a>
            </Button> */}
            <Button>
              <a href="/game">Play with Bubby Bear</a>
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};

export default Hero07;
