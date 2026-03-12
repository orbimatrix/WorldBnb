-- RENTORA DATABASE SCHEMA

-- 1. Profiles (Linked to Clerk User ID)
CREATE TABLE IF NOT EXISTS public.profiles (
  clerk_user_id TEXT PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Listings
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  country TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  max_guests INTEGER DEFAULT 1,
  amenities TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL REFERENCES public.profiles(clerk_user_id),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'upcoming', 'completed', 'cancelled')),
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  confirmation_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL REFERENCES public.profiles(clerk_user_id),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, listing_id)
);

-- 5. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL REFERENCES public.profiles(clerk_user_id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT CHECK (type IN ('booking', 'message', 'deal', 'review', 'reward', 'discovery')),
  is_read BOOLEAN DEFAULT FALSE,
  related_booking_id UUID REFERENCES public.bookings(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Basic Setup (Service role will bypass)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Sample Listings Seed (12 Diverse Global Listings)
INSERT INTO public.listings (title, description, location, country, price_per_night, image_url, category, rating, review_count, max_guests, amenities)
VALUES
('Cliffside Villa with Infinity Pool', 'Breathtaking sea views and extreme luxury.', 'Positano', 'Italy', 450, '/images/villas/villa1.jpg', 'Villa', 4.98, 214, 4, '{"Pool", "Sea View", "Wifi"}'),
('Modern Glass House in the Woods', 'Floor-to-ceiling windows with immersive nature views.', 'Portland', 'USA', 280, '/images/cabins/cabin1.jpg', 'Cabin', 4.92, 87, 2, '{"Hot Tub", "Fireplace", "Wifi"}'),
('Floating Bungalow Over Water', 'Stay right on top of the turquoise ocean.', 'Malé', 'Maldives', 590, '/images/unique/maldives.jpg', 'Unique', 5.0, 43, 2, '{"Private Beach", "Snorkeling"}'),
('Art-Deco Apartment — Beach Walk', 'Stylish city living minutes from the sand.', 'Miami', 'USA', 195, '/images/apartments/miami.jpg', 'Apartment', 4.85, 156, 3, '{"Kitchen", "Beach Access"}'),
('Castle Suite in the Highlands', 'Live like royalty in this historic castle.', 'Inverness', 'Scotland', 410, '/images/unique/castle.jpg', 'Unique', 4.95, 62, 2, '{"History", "Breakfast Included"}'),
('Zen Garden Guesthouse', 'Peaceful retreat surrounded by lush greenery.', 'Ubud', 'Bali', 120, '/images/villas/bali.jpg', 'Villa', 4.89, 198, 2, '{"Garden", "Yoga Deck"}'),
('Ski-In/Ski-Out Luxury Chalet', 'Premium mountain lodging right on the slopes.', 'Zermatt', 'Switzerland', 550, '/images/cabins/swiss.jpg', 'Cabin', 4.99, 112, 6, '{"Ski Storage", "Sauna", "Hot Tub"}'),
('Penthouse with Sky Garden', 'Urban luxury with a private rooftop oasis.', 'Tokyo', 'Japan', 380, '/images/apartments/tokyo.jpg', 'Apartment', 4.91, 75, 4, '{"Roof Garden", "City View"}'),
('Eco-Friendly Treehouse Retreat', 'Reconnect with nature in this sustainable stay.', 'Tulum', 'Mexico', 175, '/images/unique/tulum.jpg', 'Unique', 4.87, 142, 2, '{"Solar Power", "Eco-friendly"}'),
('Classic Brownstone Apartment', 'Authentic Brooklyn living in a historic home.', 'Brooklyn', 'USA', 210, '/images/apartments/brooklyn.jpg', 'Apartment', 4.83, 205, 3, '{"Kitchen", "Walking Distance"}'),
('Desert Oasis with Stargazing Deck', 'Modern comfort in the heart of the desert.', 'Joshua Tree', 'USA', 245, '/images/cabins/desert.jpg', 'Cabin', 4.96, 94, 4, '{"Stargazing Deck", "Hammock"}'),
('Seaside Cottage on the Cliffs', 'Charming cottage with dramatic ocean views.', 'Cornwall', 'UK', 165, '/images/villas/uk.jpg', 'Villa', 4.88, 128, 2, '{"Ocean View", "Hiking Trail"}');

