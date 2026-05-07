/**
 * Hardcoded hotel data matching HotelResponseDTO from the backend.
 *
 * HotelResponseDTO shape:
 *   id        : Long
 *   name      : String
 *   city      : String
 *   starRating: Integer
 *
 * Extra display fields (image, description, priceFrom) are frontend-only
 * and will be replaced by real API data in Phase 10.
 */
export const MOCK_HOTELS = [
  {
    id: 1,
    name: "The Grand Horizon",
    city: "New York",
    starRating: 5,
    priceFrom: 320,
    description:
      "Iconic luxury hotel in the heart of Manhattan with panoramic skyline views and world-class amenities.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  },
  {
    id: 2,
    name: "Sunset Boulevard Inn",
    city: "Los Angeles",
    starRating: 4,
    priceFrom: 185,
    description:
      "Stylish boutique hotel steps from Hollywood's famous landmarks and vibrant nightlife.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
  },
  {
    id: 3,
    name: "Eiffel View Palace",
    city: "Paris",
    starRating: 5,
    priceFrom: 410,
    description:
      "Elegant Parisian hotel with direct views of the Eiffel Tower and Michelin-starred dining.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
  },
  {
    id: 4,
    name: "Sakura Garden Hotel",
    city: "Tokyo",
    starRating: 4,
    priceFrom: 210,
    description:
      "Tranquil retreat blending traditional Japanese aesthetics with modern comfort in central Tokyo.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
  },
  {
    id: 5,
    name: "Desert Pearl Resort",
    city: "Dubai",
    starRating: 5,
    priceFrom: 550,
    description:
      "Ultra-luxury resort with private beach access, infinity pools, and breathtaking desert views.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
  },
  {
    id: 6,
    name: "Colosseum Suites",
    city: "Rome",
    starRating: 4,
    priceFrom: 195,
    description:
      "Charming hotel in the historic centre, walking distance from the Colosseum and Roman Forum.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
  },
  {
    id: 7,
    name: "Harbour Lights Hotel",
    city: "Sydney",
    starRating: 4,
    priceFrom: 230,
    description:
      "Contemporary waterfront hotel with stunning views of Sydney Harbour Bridge and the Opera House.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
  },
  {
    id: 8,
    name: "Maple & Stone Lodge",
    city: "Toronto",
    starRating: 3,
    priceFrom: 130,
    description:
      "Cosy mid-range hotel in downtown Toronto, perfect for business and leisure travellers alike.",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80",
  },
  {
    id: 9,
    name: "Bosphorus Terrace Hotel",
    city: "Istanbul",
    starRating: 5,
    priceFrom: 375,
    description:
      "Opulent hotel perched above the Bosphorus Strait with Ottoman-inspired décor and spa.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
  },
  {
    id: 10,
    name: "Zen Retreat Bangkok",
    city: "Bangkok",
    starRating: 3,
    priceFrom: 95,
    description:
      "Peaceful urban retreat offering Thai hospitality, rooftop pool, and easy BTS Skytrain access.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
  },
  {
    id: 11,
    name: "Andes Sky Lodge",
    city: "Buenos Aires",
    starRating: 4,
    priceFrom: 160,
    description:
      "Sophisticated hotel in the Palermo district, surrounded by galleries, restaurants, and parks.",
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80",
  },
  {
    id: 12,
    name: "Nordic Fjord Hotel",
    city: "Oslo",
    starRating: 4,
    priceFrom: 280,
    description:
      "Sleek Scandinavian design hotel with fjord views, sauna facilities, and farm-to-table cuisine.",
    image: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=600&q=80",
  },
];
