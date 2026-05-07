/**
 * Hardcoded hotel data matching HotelResponseDTO from the backend.
 *
 * HotelResponseDTO shape:
 *   id        : Long
 *   name      : String
 *   city      : String
 *   starRating: Integer
 *
 * RoomCategoryResponseDTO shape (per backend Phase 2):
 *   id           : Long
 *   categoryName : String
 *   basePrice    : Double
 *
 * Extra display fields (image, description, priceFrom, address, amenities,
 * roomCategories, gallery) are frontend-only and will be replaced by real
 * API data in Phase 10.
 */

export const MOCK_HOTELS = [
  {
    id: 1,
    name: "The Grand Horizon",
    city: "New York",
    starRating: 5,
    priceFrom: 320,
    address: "100 Central Park South, New York, NY 10019",
    description:
      "Iconic luxury hotel in the heart of Manhattan with panoramic skyline views and world-class amenities. Steps from Central Park, Fifth Avenue shopping, and Broadway theatres, The Grand Horizon offers an unrivalled New York experience with impeccable service and stunning interiors.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    ],
    amenities: ["wifi", "pool", "gym", "spa", "restaurant", "bar", "parking", "breakfast"],
    roomCategories: [
      { id: 101, categoryName: "Deluxe King Room",    basePrice: 320 },
      { id: 102, categoryName: "Premier Suite",       basePrice: 580 },
      { id: 103, categoryName: "Penthouse Suite",     basePrice: 1200 },
    ],
  },
  {
    id: 2,
    name: "Sunset Boulevard Inn",
    city: "Los Angeles",
    starRating: 4,
    priceFrom: 185,
    address: "8401 Sunset Blvd, West Hollywood, CA 90069",
    description:
      "Stylish boutique hotel steps from Hollywood's famous landmarks and vibrant nightlife. Featuring rooftop pool views of the Hollywood Hills, curated local art throughout, and a buzzing lobby bar that attracts the city's creative crowd.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
    amenities: ["wifi", "pool", "gym", "bar", "parking"],
    roomCategories: [
      { id: 201, categoryName: "Standard Queen",      basePrice: 185 },
      { id: 202, categoryName: "Deluxe King",         basePrice: 240 },
      { id: 203, categoryName: "Hollywood Suite",     basePrice: 420 },
    ],
  },
  {
    id: 3,
    name: "Eiffel View Palace",
    city: "Paris",
    starRating: 5,
    priceFrom: 410,
    address: "10 Avenue de la Bourdonnais, 75007 Paris, France",
    description:
      "Elegant Parisian hotel with direct views of the Eiffel Tower and Michelin-starred dining. Housed in a beautifully restored 19th-century Haussmann building, every room is a masterpiece of French craftsmanship, blending classical elegance with contemporary luxury.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    ],
    amenities: ["wifi", "spa", "restaurant", "bar", "breakfast", "gym"],
    roomCategories: [
      { id: 301, categoryName: "Classic Room",        basePrice: 410 },
      { id: 302, categoryName: "Eiffel View Room",    basePrice: 620 },
      { id: 303, categoryName: "Prestige Suite",      basePrice: 980 },
      { id: 304, categoryName: "Royal Suite",         basePrice: 1800 },
    ],
  },
  {
    id: 4,
    name: "Sakura Garden Hotel",
    city: "Tokyo",
    starRating: 4,
    priceFrom: 210,
    address: "3-7-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-0023",
    description:
      "Tranquil retreat blending traditional Japanese aesthetics with modern comfort in central Tokyo. The hotel features a traditional tea ceremony room, a serene zen garden, and rooms designed with shoji screens and tatami-inspired flooring.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    ],
    amenities: ["wifi", "spa", "restaurant", "gym", "breakfast"],
    roomCategories: [
      { id: 401, categoryName: "Standard Twin",       basePrice: 210 },
      { id: 402, categoryName: "Deluxe Double",       basePrice: 280 },
      { id: 403, categoryName: "Zen Suite",           basePrice: 490 },
    ],
  },
  {
    id: 5,
    name: "Desert Pearl Resort",
    city: "Dubai",
    starRating: 5,
    priceFrom: 550,
    address: "Jumeirah Beach Road, Dubai, UAE",
    description:
      "Ultra-luxury resort with private beach access, infinity pools, and breathtaking desert views. Featuring seven world-class restaurants, a 3,000 sqm spa, and butler service for every suite, Desert Pearl sets the benchmark for Arabian hospitality.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "bar", "gym", "parking", "breakfast"],
    roomCategories: [
      { id: 501, categoryName: "Deluxe Sea View",     basePrice: 550 },
      { id: 502, categoryName: "Ocean Suite",         basePrice: 950 },
      { id: 503, categoryName: "Royal Beach Villa",   basePrice: 2500 },
    ],
  },
  {
    id: 6,
    name: "Colosseum Suites",
    city: "Rome",
    starRating: 4,
    priceFrom: 195,
    address: "Via Sacra 12, 00186 Rome, Italy",
    description:
      "Charming hotel in the historic centre, walking distance from the Colosseum and Roman Forum. The property occupies a restored Renaissance palazzo with original frescoes, terracotta floors, and a rooftop terrace overlooking the ancient city.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&q=80",
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
    ],
    amenities: ["wifi", "restaurant", "bar", "breakfast"],
    roomCategories: [
      { id: 601, categoryName: "Classic Room",        basePrice: 195 },
      { id: 602, categoryName: "Superior Room",       basePrice: 260 },
      { id: 603, categoryName: "Forum View Suite",    basePrice: 450 },
    ],
  },
  {
    id: 7,
    name: "Harbour Lights Hotel",
    city: "Sydney",
    starRating: 4,
    priceFrom: 230,
    address: "11 Circular Quay East, Sydney NSW 2000, Australia",
    description:
      "Contemporary waterfront hotel with stunning views of Sydney Harbour Bridge and the Opera House. Located at Circular Quay, guests enjoy direct ferry access, world-class dining, and rooms that frame one of the world's most iconic vistas.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    ],
    amenities: ["wifi", "pool", "gym", "restaurant", "bar", "parking"],
    roomCategories: [
      { id: 701, categoryName: "City View Room",      basePrice: 230 },
      { id: 702, categoryName: "Harbour View Room",   basePrice: 340 },
      { id: 703, categoryName: "Opera Suite",         basePrice: 620 },
    ],
  },
  {
    id: 8,
    name: "Maple & Stone Lodge",
    city: "Toronto",
    starRating: 3,
    priceFrom: 130,
    address: "55 King Street West, Toronto, ON M5K 1A1, Canada",
    description:
      "Cosy mid-range hotel in downtown Toronto, perfect for business and leisure travellers alike. Featuring warm Canadian hospitality, a popular bistro serving local produce, and easy access to the Financial District and CN Tower.",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
    amenities: ["wifi", "restaurant", "gym", "parking"],
    roomCategories: [
      { id: 801, categoryName: "Standard Room",       basePrice: 130 },
      { id: 802, categoryName: "Deluxe Room",         basePrice: 175 },
    ],
  },
  {
    id: 9,
    name: "Bosphorus Terrace Hotel",
    city: "Istanbul",
    starRating: 5,
    priceFrom: 375,
    address: "Çırağan Caddesi 32, Beşiktaş, 34349 Istanbul, Turkey",
    description:
      "Opulent hotel perched above the Bosphorus Strait with Ottoman-inspired décor and spa. The hotel's hammam, private yacht pier, and terrace restaurant offering panoramic strait views make it one of Istanbul's most celebrated addresses.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "bar", "gym", "breakfast"],
    roomCategories: [
      { id: 901, categoryName: "Bosphorus Room",      basePrice: 375 },
      { id: 902, categoryName: "Deluxe Terrace Room", basePrice: 520 },
      { id: 903, categoryName: "Ottoman Suite",       basePrice: 890 },
    ],
  },
  {
    id: 10,
    name: "Zen Retreat Bangkok",
    city: "Bangkok",
    starRating: 3,
    priceFrom: 95,
    address: "89 Sukhumvit Soi 11, Khlong Toei Nuea, Bangkok 10110",
    description:
      "Peaceful urban retreat offering Thai hospitality, rooftop pool, and easy BTS Skytrain access. Surrounded by Bangkok's best street food, night markets, and cultural temples, Zen Retreat is the ideal base for exploring the city.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    ],
    amenities: ["wifi", "pool", "restaurant", "breakfast"],
    roomCategories: [
      { id: 1001, categoryName: "Superior Room",      basePrice: 95  },
      { id: 1002, categoryName: "Deluxe Room",        basePrice: 135 },
      { id: 1003, categoryName: "Pool View Suite",    basePrice: 220 },
    ],
  },
  {
    id: 11,
    name: "Andes Sky Lodge",
    city: "Buenos Aires",
    starRating: 4,
    priceFrom: 160,
    address: "Av. del Libertador 1902, Palermo, Buenos Aires, Argentina",
    description:
      "Sophisticated hotel in the Palermo district, surrounded by galleries, restaurants, and parks. The lodge features a curated wine cellar with over 300 Argentine labels, a rooftop terrace with Andes views, and a celebrated asado restaurant.",
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    ],
    amenities: ["wifi", "pool", "restaurant", "bar", "gym", "parking"],
    roomCategories: [
      { id: 1101, categoryName: "Classic Room",       basePrice: 160 },
      { id: 1102, categoryName: "Superior Room",      basePrice: 210 },
      { id: 1103, categoryName: "Palermo Suite",      basePrice: 380 },
    ],
  },
  {
    id: 12,
    name: "Nordic Fjord Hotel",
    city: "Oslo",
    starRating: 4,
    priceFrom: 280,
    address: "Aker Brygge 1, 0150 Oslo, Norway",
    description:
      "Sleek Scandinavian design hotel with fjord views, sauna facilities, and farm-to-table cuisine. Built with sustainable Norwegian timber and stone, the hotel's design celebrates the natural landscape while offering every modern comfort.",
    image: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
    amenities: ["wifi", "spa", "restaurant", "gym", "parking", "breakfast"],
    roomCategories: [
      { id: 1201, categoryName: "Fjord View Room",    basePrice: 280 },
      { id: 1202, categoryName: "Deluxe Suite",       basePrice: 420 },
      { id: 1203, categoryName: "Nordic Penthouse",   basePrice: 750 },
    ],
  },
];
