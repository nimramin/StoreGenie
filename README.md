Something Simple i spinned-up over the weekend... 

[![Watch Walkthrough](https://img.shields.io/badge/Watch%20Demo%20on-Loom-fb5c39?logo=loom&logoColor=white)](https://www.loom.com/share/51fd640b8aae4a2fa2a4c01a40174a2a?sid=da1fa74a-8dc9-4181-98a3-532ed36e6e51)


![DEMO SS](Landing%20Page.png)


# StoreGenie AI

StoreGenie AI is a modern, AI-powered e-commerce platform that allows creators to set up their own online stores and sell products with ease. This project is built with Next.js and Supabase, and it leverages the power of Google's Gemini AI to assist with product creation.

## Features

- **Google OAuth:** Secure and easy login with Google.
- **Automated Onboarding:** A simple setup process for new users to create their stores.
- **AI-Powered Product Creation:** Use AI to generate product descriptions, tags, and more.
- **Public Storefronts:** Each user gets a unique, publicly accessible storefront.
- **Product Management:** A dashboard for users to create, edit, and delete their products.
- **Shopping Cart:** Full-featured shopping cart for both guest and logged-in users.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Supabase](https://supabase.io/) (Postgres)
- **Authentication:** [Supabase Auth](https://supabase.io/docs/guides/auth)
- **Storage:** [Supabase Storage](https://supabase.io/docs/guides/storage)
- **AI:** [Google Gemini](https://ai.google.dev/)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- A [Supabase](https://supabase.io/) account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/storegenie.git
cd storegenie
```

### 2. Set Up Supabase

1.  Create a new project on [Supabase](https://supabase.io/).
2.  In the SQL Editor, run the schemas defined in `PLAN.md` to create the `profiles`, `products`, `carts`, and `cart_items` tables.
3.  Enable Google as an authentication provider in the "Auth" section of your Supabase project.
4.  Go to "Project Settings" > "API" and get your Project URL and `anon` key.

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Basic Walkthrough

1.  **Login:** Go to `/login` and sign in with your Google account.
2.  **Onboarding:** You will be redirected to `/welcome` to set up your store name and a unique store slug.
3.  **Dashboard:** After setup, you'll land on your dashboard at `/dashboard`.
4.  **Create a Product:** Navigate to `/dashboard/products` and click "New Product" to create your first item. You can use the AI assistant to help you.
5.  **View Your Store:** Your public store will be live at `/[your-store-slug]`.
6.  **View a Product:** Click on a product from your store page to see the product details at `/[your-store-slug]/[product-id]`.
