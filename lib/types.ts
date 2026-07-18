import React from "react";

export type TimelineEntry = {
  icon: React.ReactNode;
  year: string;
  title: string;
  body: string;
  fold: number;
};

export type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type Step = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type Wish = {
  num: string;
  line: string;
  from: string;
};

export type Spark = {
  left: number;
  bottom: number;
  duration: number;
  delay: number;
  size: number;
};

export type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  rotation: number;
  hue: "gold" | "pale";
};