# Frontend Implementation Plan - Hotel Booking Website

Project: Hotel Booking Website
Team: 4 members (2 Frontend, 2 Backend)
Stack: React, Bootstrap (react-bootstrap), Axios, React Router
Goal: Build a responsive, user-friendly interface for hotel discovery and booking.

## File Structure Snapshot
```
src/
├── components/         # Reusable UI components (Navbar, Footer, MainLayout, Cards, etc.)
├── pages/              # Page-level components (one per route)
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── HotelListPage.jsx
│   ├── HotelDetailsPage.jsx
│   ├── BookingPage.jsx
│   ├── BookingConfirmPage.jsx
│   ├── DashBoard.jsx
│   └── AdminDashboard.jsx
├── services/           # Axios instance and API call functions
├── context/            # Global state (AuthContext, AuthProvider)
└── utils/              # authUtil, tokenHelper, formatters
```

## Implementation Phases

PHASE 1: Project Setup & Layout ✅
Goal: Initialize the React project and establish the core layout.
Tasks:
  - Setup React with Bootstrap (react-bootstrap + bootstrap).
  - Create MainLayout with Navbar and Footer.
  - Configure React Router with all planned routes (stubs for future phases).
  - Build HomePage with hero section, destinations, features, and CTA.
  - Fix LoginPage to use AuthContext.login() instead of raw localStorage.
  - Fix ProtectedRoute to redirect to /login.
Exit Criteria: Application renders a consistent layout with working navigation links. ✅

PHASE 2: Hotel Listing Page
Goal: Display a list of hotels using hardcoded data matching the backend DTO.
Tasks:
  - Create HotelCard component (Bootstrap Card).
  - Build HotelListPage with a responsive grid.
  - Implement basic "View Details" navigation to /hotels/:id.
Exit Criteria: Users can see a grid of hotels with names, ratings, city, and images.

PHASE 3: Search & Filter Sidebar
Goal: Implement the UI for searching and filtering hotels.
Tasks:
  - Create SearchBar component (Location, Dates, Guests) using Bootstrap Form controls.
  - Build FilterSidebar (Price range, Star rating, Amenities) using Bootstrap Offcanvas or a sidebar column.
  - Sync filter state with URL query params.
Exit Criteria: Filter UI updates correctly and reflects in the browser's address bar.

PHASE 4: Hotel Details Page
Goal: Show comprehensive information about a specific hotel.
Tasks:
  - Build HotelDetailsPage layout using Bootstrap grid.
  - Display hotel description, amenities list, and location map placeholder.
  - Create RoomCategory list within the details page matching RoomCategoryResponseDTO.
Exit Criteria: Detailed view displays all relevant hotel information and room options.

PHASE 5: Room Selection & Availability UI
Goal: Allow users to select rooms and check availability.
Tasks:
  - Implement quantity selector for room categories.
  - Add "Check Availability" button with Bootstrap Spinner loading state.
  - Display "Available" vs "Sold Out" Bootstrap Badge based on mock data.
Exit Criteria: Users can select room quantities and see the calculated total price.

PHASE 6: Multi-step Booking Flow - Step 1
Goal: Collect guest details and review booking summary.
Tasks:
  - Create BookingWizard component with Bootstrap ProgressBar for step indicator.
  - Build GuestDetails form with validation (react-hook-form or controlled inputs).
  - Show summary of selected rooms and dates using Bootstrap Card.
Exit Criteria: Guest information is validated and stored in local state for the next step.

PHASE 7: Multi-step Booking Flow - Step 2 (Payment & Confirm)
Goal: Simulate payment and submit the booking.
Tasks:
  - Build PaymentForm (mock fields for card details) using Bootstrap Form.
  - Implement "Confirm Booking" action calling the API service.
  - Show Bootstrap Spinner overlay during submission.
Exit Criteria: Successful submission redirects to BookingConfirmPage with a reference number.

PHASE 8: User Dashboard & Booking History
Goal: Provide a portal for users to manage their bookings.
Tasks:
  - Build BookingHistory table using Bootstrap Table.
  - Add "Cancel Booking" button with Bootstrap Modal confirmation dialog.
Exit Criteria: Users can view their past bookings and trigger a cancellation request.

PHASE 9: Authentication Integration (Login/Register)
Goal: Connect existing backend auth endpoints to the UI.
Tasks:
  - Login and Register pages already exist — verify full AuthContext integration.
  - Ensure Axios interceptor attaches JWT to all protected requests.
  - Confirm identity persists across page refreshes via localStorage.
Exit Criteria: Users can log in, and their identity is persisted across page refreshes.

PHASE 10: Advanced Search Integration
Goal: Connect the frontend search UI to the advanced backend endpoints.
Tasks:
  - Refactor Search service to call GET /api/hotels/search/advanced.
  - Handle complex query parameter serialization.
  - Implement Bootstrap Pagination for the hotel list.
Exit Criteria: Real-time filtering and searching work against the backend database.

PHASE 11: Admin Management UI
Goal: Create interfaces for hotel and room management.
Tasks:
  - Build AdminHotelList with Edit/Delete actions using Bootstrap Table and Buttons.
  - Create AddHotel form using Bootstrap Form inside a Modal.
  - Implement Room status toggle (Maintenance/Cleaning) using Bootstrap Badge/Button.
Exit Criteria: Admins can perform CRUD operations on hotels via the UI.

PHASE 12: Final Polish & Responsive Audit
Goal: Ensure a high-quality user experience across all devices.
Tasks:
  - Add Bootstrap Toast notifications for all actions (Success/Error).
  - Audit mobile responsiveness for the booking flow using Bootstrap breakpoints.
  - Implement placeholder/skeleton loaders using Bootstrap Placeholder component.
Exit Criteria: App is fully responsive and provides clear feedback for all user actions.

## Context
React-based frontend for a hotel booking platform. Focuses on a seamless multi-step booking experience and responsive design. Uses React Bootstrap for all UI components and Bootstrap utility classes for layout and spacing.

## Current Phase
PHASE 2 — Hotel Listing Page

## Rules
- Use hardcoded data matching ResponseDTOs until integration phases.
- Prefix commits with PHASE-N:
- Use Bootstrap (react-bootstrap) for all UI components and styling.
- Use Bootstrap utility classes (mt-3, d-flex, gap-2, etc.) for layout and spacing.
- Do NOT use Tailwind CSS.

## Deployment Checklist
- Environment variables: VITE_API_URL (Vite prefix, not REACT_APP_).
- Run `npm run build` to generate production assets.
- Test production build locally using `npx serve -s dist`.
