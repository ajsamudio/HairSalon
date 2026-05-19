export interface Review {
  name: string;
  service: string;
  quote: string;
  rating: 5 | 4 | 3;
}

export const reviews: Review[] = [
  {
    name: "Sarah",
    service: "Precision Cut",
    quote:
      "Best haircut I've had in years. They actually listened to what I wanted and made it work for my hair type.",
    rating: 5,
  },
  {
    name: "Maya",
    service: "Balayage",
    quote:
      "Walked in with a Pinterest screenshot, walked out with exactly that. Honest about what would and wouldn't work. Already booked my next appointment.",
    rating: 5,
  },
  {
    name: "James",
    service: "Cut + Beard",
    quote:
      "Easy to book online, no awkward back-and-forth. Loved the salon vibe and the result.",
    rating: 5,
  },
];
