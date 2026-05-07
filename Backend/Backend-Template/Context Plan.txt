# Hotel Booking Website - Full-Stack Implementation Context

## Project Overview

**Goal**: Build a production-grade hotel booking platform enabling customers to browse hotels, check availability, and complete secure bookings with real-time inventory management.

**Stack**: Spring Boot (Backend) + React (Frontend) + PostgreSQL (Database)

**Timeline**: Hackathon format - 10-12 phases per layer (BE/FE), 15-25 minutes per phase

---

## System Architecture

### High-Level Components

**Backend (Spring Boot)**
- RESTful API with JWT-based authentication (already implemented - login/registration functional)
- Hotel and Room management services
- Booking engine with inventory synchronization
- Payment processing simulation
- Email notification service
- MapStruct for DTO-Entity mapping throughout

**Frontend (React)**
- Public browsing interface (no auth required)
- User authentication portal (login/register already works)
- Search and filter system
- Booking flow with multi-step form
- User dashboard with booking history

**Database (PostgreSQL)**
- Relational schema with proper foreign keys
- Transactional booking operations
- Audit trails for bookings

---

## Database Schema Design

### Core Entities

**User**
- id (PK), email (unique), password (hashed), firstName, lastName, phoneNumber
- role (CUSTOMER, ADMIN, HOTEL_MANAGER)
- createdAt, updatedAt
- Relationship: One-to-Many with Booking

**Hotel**
- id (PK), name, description, address, city, state, country, pincode
- starRating (1-5), contactEmail, contactPhone
- latitude, longitude (for location-based search)
- imageUrl, amenities (JSON or separate table)
- isActive, createdAt, updatedAt
- Relationship: One-to-Many with RoomCategory

**RoomCategory**
- id (PK), hotelId (FK), categoryName (Deluxe, Suite, Standard, etc.)
- basePrice, maxOccupancy, bedType
- amenities (JSON: AC, WiFi, TV, MiniBar, etc.)
- description, imageUrls (JSON array)
- createdAt, updatedAt
- Relationship: One-to-Many with Room

**Room**
- id (PK), roomCategoryId (FK), roomNumber
- floor, isActive
- currentStatus (AVAILABLE, OCCUPIED, MAINTENANCE, CLEANING)
- Relationship: One-to-Many with BookingRoom

**Booking**
- id (PK), userId (FK), hotelId (FK)
- bookingReference (unique, auto-generated: BK-timestamp-random)
- checkInDate, checkOutDate, totalNights
- totalAmount, discountAmount, finalAmount
- status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- paymentStatus (PENDING, PAID, REFUNDED)
- paymentMethod, transactionId
- specialRequests (text)
- createdAt, updatedAt, cancelledAt
- Relationship: One-to-Many with BookingRoom

**BookingRoom** (Junction table with additional data)
- id (PK), bookingId (FK), roomId (FK)
- roomCategoryId (FK) - snapshot at booking time
- pricePerNight (snapshot - price at booking time)
- numberOfNights
- Ensures: Multiple rooms can be booked in single transaction

**DiscountCode**
- id (PK), code (unique), discountType (PERCENTAGE, FIXED_AMOUNT)
- discountValue, minBookingAmount
- validFrom, validUntil, maxUsageCount, currentUsageCount
- isActive
- Relationship: Many-to-Many with Booking (optional tracking table)

**BookingHistory** (Audit/Activity Log)
- id (PK), bookingId (FK), userId (FK)
- action (CREATED, MODIFIED, CANCELLED, COMPLETED)
- previousStatus, newStatus, remarks
- timestamp

---

## Security Implementation (Already Done)

### JWT Authentication Flow
- User registration with password hashing (BCrypt)
- Login returns JWT token with user claims (userId, email, role)
- Token validation on protected endpoints via filter/interceptor
- Refresh token mechanism (if implemented)

### What's Working
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - Login with JWT response
- Protected endpoints using `@PreAuthorize` or filter chain

### Pending Security Tasks (Phase-Specific)
- Rate limiting on booking endpoints (prevent booking spam)
- CORS configuration for React frontend
- Input validation enhancement (phone, email formats, date ranges)
- Role-based access (CUSTOMER vs ADMIN endpoints)
- SQL injection prevention via parameterized queries (already handled by JPA)

---

## Backend Feature Breakdown

### Phase 1-2: Hotel Management
**Entities**: Hotel, RoomCategory, Room
**Services**: HotelService, RoomCategoryService, RoomService
**Endpoints**:
- GET `/api/hotels` - List all hotels (public)
- GET `/api/hotels/{id}` - Hotel details with room categories
- GET `/api/hotels/search` - Filter by city, starRating, priceRange
- POST `/api/hotels` - Create hotel (ADMIN only)
- PUT `/api/hotels/{id}` - Update hotel
- DELETE `/api/hotels/{id}` - Soft delete (set isActive=false)

**MapStruct Mappers**:
- HotelMapper: Hotel ↔ HotelDTO, HotelSummaryDTO
- RoomCategoryMapper: RoomCategory ↔ RoomCategoryDTO

**Validation**:
- Hotel name required, min 3 chars
- Star rating 1-5
- Contact email format
- Price must be positive

**Postman Test**: Create hotel, fetch all, search by city

---

### Phase 3-4: Room Availability Engine
**Services**: AvailabilityService
**Endpoints**:
- GET `/api/availability/search` - Find available rooms
  - Query params: `hotelId`, `checkIn`, `checkOut`, `guests`
  - Returns: List of available room categories with count
- GET `/api/availability/hotel/{hotelId}` - Availability calendar for hotel

**Business Logic**:
- Query rooms NOT in BookingRoom where booking overlaps (checkIn, checkOut)
- Group by RoomCategory, count available rooms
- Ensure checkOut > checkIn, dates not in past
- Support multi-room booking (select quantity per category)

**MapStruct**:
- AvailabilityResponseMapper: Room + RoomCategory → AvailabilityDTO

**Postman Test**: Search availability for date range, verify count decreases after booking

---

### Phase 5-6: Booking Engine (Critical)
**Services**: BookingService (transactional operations)
**Endpoints**:
- POST `/api/bookings` - Create booking (authenticated)
  - Request body: userId, hotelId, checkIn, checkOut, rooms array [{categoryId, quantity}]
  - Response: Booking with reference number
- GET `/api/bookings/user/{userId}` - User's booking history
- GET `/api/bookings/{bookingId}` - Booking details
- PUT `/api/bookings/{bookingId}/cancel` - Cancel booking

**Transaction Flow** (Single @Transactional method):
1. Validate dates, user authentication
2. Check availability for each room category + quantity
3. Lock available rooms (SELECT FOR UPDATE or optimistic locking)
4. Create Booking entity
5. Create BookingRoom entries linking rooms to booking
6. Update Room status to OCCUPIED (or keep AVAILABLE until checkIn date)
7. Generate unique booking reference (BK-{timestamp}-{random})
8. Calculate total amount (rooms × nights × price)
9. Apply discount if code provided
10. Return BookingDTO with confirmation

**MapStruct**:
- BookingMapper: Booking ↔ BookingDTO, BookingResponseDTO
- Include nested room details, hotel info in response

**Edge Cases**:
- Concurrent bookings (handle race condition with DB locks)
- Partial availability (requested 3 rooms, only 2 available → fail or partial book?)
- Invalid discount codes
- Past dates, checkOut before checkIn

**Postman Test**: 
- Create booking, verify rooms allocated
- Try duplicate booking for same dates → should fail
- Cancel booking, verify room released

---

### Phase 7: Discount & Promotions
**Services**: DiscountService
**Endpoints**:
- POST `/api/discounts/validate` - Validate discount code
  - Input: code, bookingAmount
  - Output: discountAmount, finalAmount
- GET `/api/discounts/active` - List active promotions (public)
- POST `/api/discounts` - Create discount (ADMIN)

**Business Logic**:
- Check code validity (dates, usage count)
- Verify min booking amount
- Calculate discount (percentage or fixed)
- Atomic increment of usage count

**MapStruct**:
- DiscountMapper: DiscountCode ↔ DiscountDTO

**Postman Test**: Apply code, verify discount calculation

---

### Phase 8: Email Notifications (Stretch)
**Services**: EmailService (using JavaMailSender or third-party like SendGrid)
**Trigger Points**:
- Booking confirmed → Send confirmation email
- Booking cancelled → Send cancellation notice
- 24h before checkIn → Send reminder (scheduled job)

**Email Template**:
- Booking reference, hotel name, room details
- Check-in/check-out dates, total amount
- QR code or confirmation barcode (optional)

**Implementation**:
- Async email sending (don't block booking response)
- @Async method in EmailService
- HTML templates with Thymeleaf or plain text

**Testing**: Log email content during development, verify formatting

---

### Phase 9: Search & Filtering Enhancements
**Enhanced Search Endpoint**: GET `/api/hotels/search/advanced`
**Query Parameters**:
- location (city/state), checkIn, checkOut
- priceMin, priceMax (per night)
- starRating (array: 3,4,5)
- amenities (array: WiFi, Parking, Pool, Gym)
- sortBy (price_asc, price_desc, rating, distance)

**Services**: HotelSearchService with Specification or Criteria API
**Business Logic**:
- Join Hotel → RoomCategory for price filtering
- Join availability subquery for date-based filtering
- Filter by amenities (JSON contains or separate amenity table)
- Distance-based search using Haversine formula (lat/lng)

**Postman Test**: Complex query with multiple filters, verify SQL performance

---

### Phase 10: Booking History & Rebooking
**Endpoints**:
- GET `/api/bookings/user/{userId}/history` - Paginated booking history
  - Filter: status (all, upcoming, past, cancelled)
  - Sort: date descending
- POST `/api/bookings/{bookingId}/rebook` - Clone booking for new dates
  - Input: new checkIn, checkOut
  - Output: New booking with same hotel/room preferences

**MapStruct**:
- BookingHistoryMapper: Booking → BookingHistoryDTO (summary view)

**Postman Test**: Fetch history, rebook past booking

---

### Phase 11-12: Admin & Reporting
**Endpoints** (ADMIN role only):
- GET `/api/admin/bookings` - All bookings with filters
- GET `/api/admin/revenue` - Revenue report by date range
- GET `/api/admin/occupancy` - Occupancy rate by hotel
- PUT `/api/admin/rooms/{roomId}/status` - Update room status (MAINTENANCE, CLEANING)

**Services**: AdminService, ReportingService
**Business Logic**:
- Aggregate revenue by hotel/date
- Calculate occupancy percentage
- Export reports as CSV (optional)

---

## Frontend Feature Breakdown

### Phase 1-2: Landing & Hotel Listing
**Components**:
- `LandingPage` - Hero section, featured hotels
- `HotelList` - Grid/list view of hotels
- `HotelCard` - Hotel summary with image, rating, price

**API Integration**:
- Fetch `/api/hotels` on mount
- Display hotels with lazy loading or pagination

**UI Features**:
- Skeleton loaders during fetch
- Responsive grid (mobile, tablet, desktop)
- Star rating visual (★★★★☆)

**Smoke Test**: Load page, verify hotels render, click hotel card

---

### Phase 3-4: Search & Filter Interface
**Components**:
- `SearchBar` - Location, checkIn, checkOut, guests
- `FilterSidebar` - Price range slider, star rating checkboxes, amenities
- `HotelList` (enhanced) - Apply filters, update URL params

**State Management**:
- Use `useState` for filters (or Context API)
- Debounce search input (300ms)
- Update URL query params for shareable links

**API Integration**:
- Call `/api/hotels/search/advanced` with filter params
- Handle empty results (show "No hotels found" message)

**Smoke Test**: Enter dates, apply filters, verify filtered results

---

### Phase 5-6: Hotel Details & Room Selection
**Components**:
- `HotelDetailPage` - Hotel info, amenities, location map
- `RoomCategoryCard` - Room type, price, amenities, availability
- `RoomSelector` - Quantity selector per category

**API Integration**:
- Fetch `/api/hotels/{id}` for hotel details
- Fetch `/api/availability/hotel/{id}?checkIn=X&checkOut=Y` for room availability

**State Management**:
- Cart state: selected rooms [{categoryId, quantity, price}]
- Calculate total dynamically

**UI Features**:
- Image gallery (carousel or modal)
- Embedded Google Maps for hotel location
- Disable room selection if unavailable

**Smoke Test**: View hotel, select rooms, verify cart updates

---

### Phase 7-8: Booking Flow (Multi-Step Form)
**Components**:
- `BookingWizard` - Stepper (Guest Info → Review → Payment → Confirmation)
- `GuestInfoForm` - Name, email, phone, special requests
- `BookingReview` - Summary of hotel, rooms, dates, total
- `PaymentForm` - Simulated payment (card details optional)
- `BookingConfirmation` - Success page with reference number

**API Integration**:
- POST `/api/bookings` on final step
- Handle loading state, errors (show toast/modal)

**Validation**:
- Email format, phone number length
- Date validation (already done in search)
- Required fields before proceeding

**State Management**:
- Wizard state: current step, form data
- Persist booking data temporarily (sessionStorage)

**Smoke Test**: Complete booking flow, verify confirmation page

---

### Phase 9: User Dashboard & Booking History
**Components**:
- `UserDashboard` - Tab navigation (Upcoming, Past, Cancelled)
- `BookingCard` - Booking summary with reference, dates, hotel
- `BookingDetailModal` - Full booking details, cancel button

**API Integration**:
- GET `/api/bookings/user/{userId}/history`
- PUT `/api/bookings/{id}/cancel` on cancel action

**UI Features**:
- Status badges (Confirmed, Cancelled, Completed)
- "Rebook" button for past bookings
- Confirmation dialog before cancellation

**Smoke Test**: View bookings, cancel one, verify status update

---

### Phase 10: Discount Code Application
**Components**:
- `DiscountCodeInput` - Input field + "Apply" button in booking review

**API Integration**:
- POST `/api/discounts/validate` on apply
- Update total amount on success
- Show error for invalid codes

**UI Features**:
- Display discount amount with strikethrough original price
- Remove code option

**Smoke Test**: Apply valid/invalid codes, verify price update

---

### Phase 11-12: Stretch Features & Polish
**Features**:
- Email confirmation display (show message after booking)
- Loyalty rewards badge (if user has multiple bookings)
- Seasonal promotions banner on landing page
- Quick rebooking from history (pre-fill search with same hotel)

**UI Enhancements**:
- Loading skeletons, error boundaries
- Toast notifications (success, error, info)
- Accessibility (ARIA labels, keyboard navigation)
- Dark mode toggle (optional)

---

## MapStruct Integration Guidelines

### Why MapStruct
- Eliminates manual DTO-Entity conversion boilerplate
- Compile-time type safety (errors caught early)
- Performance (no reflection overhead)
- Clean separation: Entity (DB) vs DTO (API)

### Mapper Structure Pattern

**Basic Mapper**:
```
Interface with @Mapper annotation
Component model = "spring" for Spring injection
Methods: Entity to DTO, DTO to Entity
List conversion methods
```

**Nested Mapping**:
```
HotelDTO includes List<RoomCategoryDTO>
Use @Mapping for custom field names
Example: @Mapping(source = "contactEmail", target = "email")
```

**Ignore Fields**:
```
@Mapping(target = "password", ignore = true) for UserDTO
Never expose sensitive fields in responses
```

### Implementation Per Phase

**Phase 1-2 (Hotel)**:
- HotelMapper: Hotel ↔ HotelDTO, HotelSummaryDTO
- RoomCategoryMapper: RoomCategory ↔ RoomCategoryDTO
- Inject mappers in service layer, never in controllers

**Phase 5-6 (Booking)**:
- BookingMapper with nested room details
- Custom methods for response DTOs with calculated fields (totalNights, finalAmount)

**Phase 9 (Search)**:
- SearchResultMapper: Hotel + Availability → SearchResultDTO
- Flatten nested structures for client consumption

### Testing Mappers
- Unit test each mapper independently
- Verify null handling, default values
- Check nested object mapping correctness

---

## API Design Principles

### REST Conventions
- Use plural nouns: `/api/hotels`, `/api/bookings`
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)
- Status codes: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)

### Request/Response Standards
**Request DTOs**: Validation annotations (@NotNull, @Email, @Min, @Max)
**Response DTOs**: Consistent structure with metadata
```
Success: { status: "success", data: {...}, message: "..." }
Error: { status: "error", error: {...}, message: "..." }
```

### Pagination & Sorting
- Use `Pageable` parameter in Spring
- Response includes: content, totalPages, totalElements, currentPage

### Error Handling
- Global exception handler (@ControllerAdvice)
- Custom exceptions: ResourceNotFoundException, InvalidBookingException
- Return meaningful error messages (not stack traces)

---

## Testing Strategy

### Backend Testing (Postman)
**Per Phase Checklist**:
1. Happy path: Valid input → Success response
2. Edge cases: Null values, empty lists, boundary conditions
3. Error cases: Invalid IDs, unauthorized access, duplicate entries
4. Concurrent requests: Multiple bookings for same room

**Postman Collections Structure**:
- Folder per entity (Hotels, Bookings, Auth)
- Environment variables: baseUrl, token, testUserId
- Pre-request scripts for token refresh
- Test scripts for assertions (status code, response schema)

### Frontend Testing (Browser)
**Smoke Test Checkpoints**:
1. Page loads without errors (check console)
2. API calls return data (Network tab)
3. User interactions work (click, type, submit)
4. Error messages display correctly
5. Responsive layout (mobile, tablet, desktop)

### Integration Testing
**End-to-End Flow** (Final 30 mins):
1. Register new user
2. Browse hotels, apply filters
3. Select hotel, check availability
4. Complete booking with discount code
5. View booking in dashboard
6. Cancel booking
7. Verify email sent (check logs)

---

## Git Workflow (HCL Hackathon Rules)

### Branch Strategy
- `main` - production-ready code
- One person owns merges to main
- Each developer works in feature branches

### Commit Guidelines
**Per Phase**:
1. Complete feature implementation
2. Quick test (Postman for BE, browser for FE)
3. `git add .`
4. `git commit -m "Phase X: Feature description"`
5. `git push origin <your-branch>`
6. **Each team member pushes from their own account**

**Commit Message Format**:
```
Phase 1: Add Hotel entity and CRUD endpoints
Phase 5: Implement booking engine with transaction management
Phase 9: Add search filters and sorting
```

### Target Metrics
- 20+ meaningful commits across 4 people
- Every phase ends with: code complete → test → commit → push
- Visible contribution graph for each team member

---

## Team Split & Ownership

### Backend Team (2 members)
**Member 1 Focus**:
- Phases 1-2: Hotel management
- Phases 5-6: Booking engine
- Phases 9-10: Search & history

**Member 2 Focus**:
- Phases 3-4: Availability engine
- Phases 7-8: Discounts & emails
- Phases 11-12: Admin & reporting

**Shared Responsibility**:
- Security validation (Phase 0 setup)
- MapStruct mapper creation
- Postman collection maintenance

### Frontend Team (2 members)
**Member 1 Focus**:
- Phases 1-2: Landing & listing
- Phases 5-6: Hotel details & room selection
- Phases 9-10: Dashboard & history

**Member 2 Focus**:
- Phases 3-4: Search & filters
- Phases 7-8: Booking flow
- Phases 11-12: Stretch features & polish

**Shared Responsibility**:
- API integration setup (Axios config)
- State management architecture
- Responsive design consistency

---

## Tech Stack Details

### Backend Dependencies
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security (JWT already configured)
- Spring Boot Starter Validation
- MapStruct (+ lombok-mapstruct-binding)
- PostgreSQL Driver
- JWT Library (jjwt-api, jjwt-impl, jjwt-jackson)
- JavaMailSender (for emails)
- Lombok

### Frontend Dependencies
- React 18+
- React Router DOM (navigation)
- Axios (API calls)
- React Query or SWR (data fetching, optional)
- Tailwind CSS or Material-UI (styling)
- Date picker library (react-datepicker)
- Form validation (Formik + Yup or React Hook Form)
- Toast notifications (react-hot-toast)

### Database Setup
- PostgreSQL 14+
- Schema: `hotel_booking`
- Connection: Spring Boot application.properties with credentials
- Migrations: Flyway or Liquibase (optional, manual SQL scripts acceptable)

---

## Deployment Checklist (Final Phase)

### Backend Deployment
- Build JAR: `mvn clean package`
- Run: `java -jar target/hotel-booking-0.0.1-SNAPSHOT.jar`
- Verify: Health check endpoint `/actuator/health`
- Accessible at: `http://localhost:8080`

### Frontend Deployment
- Build: `npm run build`
- Serve: `npx serve -s build` or deploy to Netlify/Vercel
- Verify: Landing page loads, API calls reach backend
- Accessible at: `http://localhost:3000` (dev) or deployed URL

### Database Deployment
- Cloud: Azure Database for PostgreSQL or Render
- Local: Docker container or native PostgreSQL
- Verify: Connection test from backend

### Environment Variables
**Backend** (application.properties or .env):
```
DB_URL, DB_USERNAME, DB_PASSWORD
JWT_SECRET, JWT_EXPIRATION
MAIL_USERNAME, MAIL_PASSWORD (if email enabled)
```

**Frontend** (.env):
```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Known Issues & Solutions

### Common Backend Pitfalls
**Issue**: Concurrent booking race condition
**Solution**: Use pessimistic locking (`SELECT FOR UPDATE`) or optimistic locking with version field

**Issue**: JWT token expiration mid-booking
**Solution**: Implement token refresh mechanism or extend expiration time

**Issue**: N+1 query problem in hotel listing
**Solution**: Use `@EntityGraph` or `JOIN FETCH` in queries

### Common Frontend Pitfalls
**Issue**: Stale availability data after booking
**Solution**: Invalidate cache or refetch after booking success

**Issue**: Date picker timezone issues
**Solution**: Store dates in UTC, convert to local for display

**Issue**: Form state lost on page refresh
**Solution**: Persist wizard state in sessionStorage

---

## Success Criteria

### Functional Requirements (Must-Have)
✓ User can browse hotels without login
✓ User can register and login (JWT working)
✓ User can search hotels by location and dates
✓ User can view hotel details and room availability
✓ User can complete booking with payment simulation
✓ User receives booking confirmation with reference number
✓ User can view booking history
✓ User can cancel bookings
✓ Admin can manage hotels and rooms

### Technical Requirements (Must-Have)
✓ MapStruct used for all DTO-Entity conversions
✓ JWT security implemented (already done)
✓ Transactional booking with inventory update
✓ REST API validated via Postman (all endpoints tested)
✓ Git: 20+ commits across 4 team members
✓ Phase-wise development with checkpoints
✓ Responsive frontend (mobile + desktop)

### Stretch Goals (Nice-to-Have)
✓ Email confirmation system
✓ Discount code functionality
✓ Rebooking from history
✓ Admin revenue reporting
✓ Google Maps integration
✓ Advanced search with amenity filters

---

## Final Notes

### Security Validation Tasks
Since JWT auth is already implemented, focus on:
- Input validation on all DTOs (email format, date ranges, positive prices)
- SQL injection prevention (verify JPA parameterized queries)
- XSS prevention (sanitize user inputs like special requests)
- CORS configuration for React origin
- Rate limiting on booking endpoint (optional: use Bucket4j)

### Performance Optimization
- Add database indexes: (hotelId, checkInDate, checkOutDate) on BookingRoom
- Enable query logging in development (show SQL, parameters)
- Use pagination for large lists (bookings, hotels)
- Lazy loading for images (frontend)

### Documentation
- README.md: Setup instructions, API endpoints, team roles
- API documentation: Swagger/OpenAPI spec (optional)
- Postman collection export (share with team)

### Presentation Tips
- Demonstrate complete booking flow (live)
- Show concurrent booking handling
- Highlight MapStruct usage (explain benefit)
- Showcase responsive design (resize browser)
- Explain team split and commit graph

---

**End of Context Document**
