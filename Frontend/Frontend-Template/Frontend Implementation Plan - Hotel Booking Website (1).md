# Frontend Implementation Plan - Hotel Booking Website

Project: Hotel Booking Website
Team: 4 members (2 Frontend, 2 Backend)
Stack: React, Tailwind CSS, Axios, React Router
Goal: Build a responsive, user-friendly interface for hotel discovery and booking.

## File Structure Snapshot
```
src/
├── components/         # Reusable UI components (Buttons, Cards, Inputs)
├── features/           # Feature-based modules
│   ├── auth/           # Login, Register
│   ├── hotels/         # Listing, Details, Search
│   ├── bookings/       # Booking flow, History
│   └── admin/          # Admin dashboard
├── services/           # Axios instance and API calls
├── hooks/              # Custom React hooks
├── context/            # Global state (Auth, Cart)
└── utils/              # Formatters, Constants
```

## Implementation Phases

PHASE 1: Project Setup & Layout
Goal: Initialize the React project and establish the core layout.
Tasks:
  - Setup React with Tailwind CSS.
  - Create MainLayout with Navbar and Footer.
  - Configure React Router with basic routes.
Exit Criteria: Application renders a consistent layout with working navigation links.

PHASE 2: Hotel Listing Page
Goal: Display a list of hotels using hardcoded data matching the backend DTO.
Tasks:
  - Create HotelCard component.
  - Build HotelList page.
  - Implement basic "View Details" navigation.
Exit Criteria: Users can see a grid/list of hotels with names, ratings, and images.

PHASE 3: Search & Filter Sidebar
Goal: Implement the UI for searching and filtering hotels.
Tasks:
  - Create SearchBar component (Location, Dates, Guests).
  - Build FilterSidebar (Price range, Star rating, Amenities).
  - Sync filter state with the URL/Query params.
Exit Criteria: Filter UI updates correctly and reflects in the browser's address bar.

PHASE 4: Hotel Details Page
Goal: Show comprehensive information about a specific hotel.
Tasks:
  - Build HotelDetails page layout.
  - Display hotel description, amenities, and location map placeholder.
  - Create RoomCategory list within the details page.
Exit Criteria: Detailed view displays all relevant hotel information and room options.

PHASE 5: Room Selection & Availability UI
Goal: Allow users to select rooms and check availability.
Tasks:
  - Implement quantity selector for room categories.
  - Add "Check Availability" button with loading states.
  - Display "Available" vs "Sold Out" status based on mock data.
Exit Criteria: Users can select room quantities and see the calculated total price.

PHASE 6: Multi-step Booking Flow - Step 1
Goal: Collect guest details and review booking summary.
Tasks:
  - Create BookingWizard component.
  - Build GuestDetails form with validation (Formik/Yup).
  - Show summary of selected rooms and dates.
Exit Criteria: Guest information is validated and stored in local state for the next step.

PHASE 7: Multi-step Booking Flow - Step 2 (Payment & Confirm)
Goal: Simulate payment and submit the booking.
Tasks:
  - Build PaymentForm (Mock fields for Card details).
  - Implement "Confirm Booking" action calling the API service.
  - Show loading overlay during submission.
Exit Criteria: Successful submission redirects to a confirmation page with a reference number.

PHASE 8: User Dashboard & Booking History
Goal: Provide a portal for users to manage their bookings.
Tasks:
  - Create Dashboard layout.
  - Build BookingHistory table/list.
  - Add "Cancel Booking" button with confirmation modal.
Exit Criteria: Users can view their past bookings and trigger a cancellation request.

PHASE 9: Authentication Integration (Login/Register)
Goal: Connect existing backend auth endpoints to the UI.
Tasks:
  - Create Login and Register pages.
  - Implement AuthContext to store JWT and user info.
  - Add Axios interceptors to include JWT in protected requests.
Exit Criteria: Users can log in, and their identity is persisted across page refreshes.

PHASE 10: Advanced Search Integration
Goal: Connect the frontend search UI to the advanced backend endpoints.
Tasks:
  - Refactor Search service to use the `/api/hotels/search/advanced` endpoint.
  - Handle complex query parameter serialization.
  - Implement pagination for the hotel list.
Exit Criteria: Real-time filtering and searching work against the backend database.

PHASE 11: Admin Management UI
Goal: Create interfaces for hotel and room management.
Tasks:
  - Build AdminHotelList with Edit/Delete actions.
  - Create AddHotel form.
  - Implement Room status toggle (Maintenance/Cleaning).
Exit Criteria: Admins can perform CRUD operations on hotels via the UI.

PHASE 12: Final Polish & Responsive Audit
Goal: Ensure a high-quality user experience across all devices.
Tasks:
  - Add Toast notifications for all actions (Success/Error).
  - Audit mobile responsiveness for the booking flow.
  - Implement skeleton loaders for better perceived performance.
Exit Criteria: App is fully responsive and provides clear feedback for all user actions.

## Context
React-based frontend for a hotel booking platform. Focuses on a seamless multi-step booking experience and responsive design.

## Current Phase
PHASE 1 — Project Setup & Layout

## Rules
- Use hardcoded data matching ResponseDTOs until integration phases.
- Prefix commits with PHASE-N:
- Use Tailwind CSS for all styling.

## Deployment Checklist
- Environment variables: REACT_APP_API_URL.
- Run `npm run build` to generate production assets.
- Test production build locally using `npx serve -s build`.
