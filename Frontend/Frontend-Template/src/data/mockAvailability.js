/**
 * Mock availability data matching AvailabilityResponseDTO from the backend.
 *
 * AvailabilityResponseDTO shape (backend Phase 3):
 *   categoryId     : Long
 *   categoryName   : String
 *   availableCount : Integer
 *   price          : Double
 *
 * Keyed by categoryId for O(1) lookup.
 * Will be replaced by GET /api/availability/search in Phase 10.
 */
export const MOCK_AVAILABILITY = {
  // Hotel 1 — The Grand Horizon
  101: { categoryId: 101, availableCount: 4 },
  102: { categoryId: 102, availableCount: 2 },
  103: { categoryId: 103, availableCount: 0 }, // Sold out

  // Hotel 2 — Sunset Boulevard Inn
  201: { categoryId: 201, availableCount: 6 },
  202: { categoryId: 202, availableCount: 3 },
  203: { categoryId: 203, availableCount: 1 },

  // Hotel 3 — Eiffel View Palace
  301: { categoryId: 301, availableCount: 5 },
  302: { categoryId: 302, availableCount: 2 },
  303: { categoryId: 303, availableCount: 0 }, // Sold out
  304: { categoryId: 304, availableCount: 1 },

  // Hotel 4 — Sakura Garden Hotel
  401: { categoryId: 401, availableCount: 8 },
  402: { categoryId: 402, availableCount: 4 },
  403: { categoryId: 403, availableCount: 2 },

  // Hotel 5 — Desert Pearl Resort
  501: { categoryId: 501, availableCount: 3 },
  502: { categoryId: 502, availableCount: 0 }, // Sold out
  503: { categoryId: 503, availableCount: 1 },

  // Hotel 6 — Colosseum Suites
  601: { categoryId: 601, availableCount: 7 },
  602: { categoryId: 602, availableCount: 3 },
  603: { categoryId: 603, availableCount: 0 }, // Sold out

  // Hotel 7 — Harbour Lights Hotel
  701: { categoryId: 701, availableCount: 5 },
  702: { categoryId: 702, availableCount: 2 },
  703: { categoryId: 703, availableCount: 1 },

  // Hotel 8 — Maple & Stone Lodge
  801: { categoryId: 801, availableCount: 10 },
  802: { categoryId: 802, availableCount: 5 },

  // Hotel 9 — Bosphorus Terrace Hotel
  901: { categoryId: 901, availableCount: 4 },
  902: { categoryId: 902, availableCount: 2 },
  903: { categoryId: 903, availableCount: 0 }, // Sold out

  // Hotel 10 — Zen Retreat Bangkok
  1001: { categoryId: 1001, availableCount: 9 },
  1002: { categoryId: 1002, availableCount: 4 },
  1003: { categoryId: 1003, availableCount: 2 },

  // Hotel 11 — Andes Sky Lodge
  1101: { categoryId: 1101, availableCount: 6 },
  1102: { categoryId: 1102, availableCount: 3 },
  1103: { categoryId: 1103, availableCount: 1 },

  // Hotel 12 — Nordic Fjord Hotel
  1201: { categoryId: 1201, availableCount: 5 },
  1202: { categoryId: 1202, availableCount: 2 },
  1203: { categoryId: 1203, availableCount: 0 }, // Sold out
};
