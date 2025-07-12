# StoreGenie AI - Development Plan

This document outlines the development plan for the StoreGenie AI MVP. It serves as our single source of truth for the project's tasks and progress.

## High-Level Architecture

We will build a multi-tenant application using Next.js and Supabase. Each artist will have their own unique storefront URL. We will implement a testing strategy focused on API routes to ensure backend stability.

```mermaid
graph TD
    subgraph "Phase 1: Core Auth & Setup"
        A1[**Auth:** Implement Google OAuth Login] --> T1( **Test:** Verify Google Login & Dashboard Access);
        T1 --> DB1[**DB:** Design 'profiles' table];
        DB1 --> DB2(**DB:** Create Trigger for auto-profile creation on new user);
        DB2 --> A4(**Middleware:** Protect '/dashboard' routes);
        A4 --> T3( **Test:** Verify middleware protection);
    end

    subgraph "Phase 2: Product Management (Dashboard)"
        P1(Create Product Upload Form) --> P2(Setup Supabase Storage);
        P2 --> P3(Create `POST /api/products` endpoint) --> T4( **Test:** Write test for Product Creation API);
    end

    subgraph "Phase 3: Public Storefront"
        S1(Create Dynamic Store & Product Pages) --> S2(Implement 'Reserve/Buy' API) --> T5( **Test:** Write test for Reservation API);
        T5 --> S3(Implement 'Custom Request' API) --> T6( **Test:** Write test for Custom Request API);
    end

    A4 --> P1;
    T4 --> S1;
```

## Task Checklist

- [x] **Auth:** Implement Google OAuth Login
- [x] **Test:** Verify Google Login flow and dashboard access
- [x] **DB:** Design and create the `profiles` table in Supabase
- [x] **DB:** Create a Supabase trigger to auto-create a profile on user signup
- [x] **Auth:** Create middleware to protect `/dashboard` and its sub-routes
- [x] **Test:** Write a test to verify middleware is protecting routes
- [x] **Dashboard:** Create a basic authenticated dashboard page
- [x] **Products:** Create product upload form at `/dashboard/products/new`
- [x] **Products:** Configure Supabase Storage for product images
- [ ] **Products:** Build `POST /api/products` endpoint
- [ ] **Test:** Write a test for the product creation API
- [ ] **Storefront:** Develop the dynamic public-facing store page at `/[artistStore]`
- [ ] **Storefront:** Develop the dynamic public-facing product page at `/[artistStore]/[productId]`
- [ ] **Storefront:** Implement "Reserve/Buy" feature with an API endpoint
- [ ] **Test:** Write a test for the reservation API
- [ ] **Storefront:** Implement "Custom Request" feature with an API endpoint
- [ ] **Test:** Write a test for the custom request API
- [ ] **Analytics:** Create the `/dashboard/analytics` page
