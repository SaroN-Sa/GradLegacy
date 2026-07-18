"use client";
import { Quote } from "lucide-react";

export function QuoteSection() {
  return (
    <section>
      <div className="quote-wrap">
        <Quote className="quote-icon" size={34} />
        <p>
          We didn't just save photos. We built somewhere our whole family can go back to and feel
          it all over again.
        </p>
        <div className="attr">THE RAMIREZ FAMILY · GRADLEGACY</div>
      </div>
    </section>
  );
}