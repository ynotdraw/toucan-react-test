import * as React from "react";

export const elements = [
  "Sprinkles",
  "Hot fudge",
  "Whipped cream",
  "Pickles",
  "Avocado",
  "Banana",
  "Oreo",
  "Chopped walnuts",
  "Chocolate sprinkles",
  "Swedish fish",
  "Mini M&Ms",
  "Snickers",
  "Chocolate chips",
];

export default function MultiselectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-titles-and-attributes">
      <div className="flex-col max-w-lg">
        <h2 className="type-2xl mb-2">Sundae order form</h2>
        <p className="type-lg mb-8">
          All sunades come with a scoop of chocolate, strawberry, and vanilla
          ice cream.
        </p>
        {children}
      </div>
    </div>
  );
}
