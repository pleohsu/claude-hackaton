# ShellCycle 🦐♻️

**Transform Seafood Waste into Sustainable Biomaterials**

ShellCycle is a platform that connects seafood restaurants generating crustacean shell waste with research labs that need shells for chitosan extraction and biomaterial research.

## 🌊 Overview

Every year, the seafood industry generates 6-8 million tons of crustacean shell waste globally, with 90% ending up in landfills. ShellCycle addresses this problem by creating an intelligent matching platform that turns this waste into valuable research materials.

### Key Features

- **Restaurant Portal**: Submit weekly shell supply listings (type, quantity, storage)
- **Lab Portal**: Request specific shell types for research
- **Intelligent Matching**: Algorithm matches supply with demand based on type, quantity, and distance
- **Interactive Map**: Visualize matched restaurants and labs
- **Dashboard Analytics**: Track supply, demand, and matches

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet
- **Validation**: Zod
- **Geocoding**: OpenStreetMap Nominatim / Google Maps API

## 📁 Project Structure

```
shellcycle/
├── app/
│   ├── page.tsx                     # Landing page
│   ├── about/page.tsx               # About page
│   ├── layout.tsx                   # Root layout
│   ├── register/
│   │   ├── restaurant/page.tsx      # Restaurant registration
│   │   └── lab/page.tsx             # Lab registration
│   ├── dashboard/
│   │   ├── restaurant/page.tsx      # Restaurant dashboard
│   │   ├── lab/page.tsx             # Lab dashboard
│   │   └── matches/page.tsx         # Matches overview
│   ├── supply/new/page.tsx          # Create supply listing
│   ├── demand/new/page.tsx          # Create demand request
│   ├── api/
│   │   ├── supply/route.ts          # Supply CRUD endpoints
│   │   ├── demand/route.ts          # Demand CRUD endpoints
│   │   ├── match/route.ts           # Matching algorithm
│   │   ├── users/route.ts           # User registration/auth
│   │   ├── geocode/route.ts         # Address geocoding
│   │   └── health/route.ts          # Health check
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MapView.tsx              # Interactive map
│   │   ├── ShellTypeSelector.tsx    # Shell type picker
│   │   ├── InputCard.tsx            # Form components
│   │   ├── DashboardCard.tsx        # Stats cards
│   │   └── MatchCard.tsx            # Match display
│   ├── styles/
│   │   └── globals.css              # Global styles
│   └── util/
│       ├── supabaseClient.ts        # DB client & types
│       ├── validators.ts            # Zod schemas
│       └── geolocation.ts           # Distance calculations
├── supabase/
│   ├── schema.sql                   # Database schema
│   └── seed.sql                     # Sample data
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Optional: Google Maps API key for geocoding

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shellcycle.git
   cd shellcycle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste contents of `supabase/schema.sql`
   - Execute the query

   c. (Optional) Load seed data:
   - Copy and paste contents of `supabase/seed.sql`
   - Execute the query

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Optional: For better geocoding
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Tables

- **users**: Authentication and basic user info
- **restaurants**: Restaurant profiles and locations
- **labs**: Research lab profiles and requirements
- **supply_streams**: Shell supply listings from restaurants
- **demand_streams**: Shell demand requests from labs
- **matches**: Matched supply-demand pairs
- **pickup_history**: Completed pickup records

### Shell Types Supported

- Shrimp 🦐
- Crab 🦀
- Lobster 🦞
- Prawn
- Crayfish
- Squid Pen 🦑

## 🧮 Matching Algorithm

The matching algorithm runs when creating new supply/demand streams or can be triggered via API:

```typescript
POST /api/match
```

### Algorithm Steps:

1. **Find Candidates**: Get all active demand streams
2. **Type Matching**: Filter supplies with matching shell type
3. **Distance Calculation**: Calculate Haversine distance between lab and restaurant
4. **Radius Filtering**: Keep only supplies within lab's max pickup radius
5. **Quantity Matching**: Ensure supply ≥ 70% of demand
6. **Ranking**: Sort by distance (closest first)
7. **Match Creation**: Create match entries for best candidates

### Example Match Request:

```bash
# Run matching algorithm for all active streams
curl -X POST http://localhost:3000/api/match

# Create specific match
curl -X POST http://localhost:3000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "demand_id": "uuid-here",
    "supply_id": "uuid-here"
  }'
```

## 🔌 API Endpoints

### Users
- `POST /api/users` - Register new user (restaurant or lab)
- `GET /api/users?id={id}` - Get user by ID
- `GET /api/users?email={email}` - Get user by email

### Supply
- `POST /api/supply` - Create supply stream
- `GET /api/supply?restaurant_id={id}` - Get restaurant's supplies
- `PATCH /api/supply` - Update supply stream
- `DELETE /api/supply?id={id}` - Delete supply stream

### Demand
- `POST /api/demand` - Create demand stream
- `GET /api/demand?lab_id={id}` - Get lab's demands
- `PATCH /api/demand` - Update demand stream
- `DELETE /api/demand?id={id}` - Delete demand stream

### Matching
- `POST /api/match` - Run matching algorithm
- `GET /api/match?restaurant_id={id}` - Get restaurant's matches
- `GET /api/match?lab_id={id}` - Get lab's matches
- `PATCH /api/match` - Update match status

### Utilities
- `GET /api/geocode?address={address}` - Geocode an address
- `GET /api/health` - Health check

## 🎨 User Flows

### For Restaurants:

1. **Register** → `/register/restaurant`
   - Provide name, email, address
   - Set default storage method and cleanliness level
   - Specify pickup windows

2. **Add Supply** → `/supply/new`
   - Select shell type(s)
   - Enter weekly quantity
   - Add notes

3. **View Dashboard** → `/dashboard/restaurant`
   - See active supply streams
   - View matched labs
   - Track recycled quantities

### For Labs:

1. **Register** → `/register/lab`
   - Provide institution details
   - Set max pickup radius
   - Describe research application

2. **Add Demand** → `/demand/new`
   - Select shell type(s) needed
   - Enter weekly quantity needed
   - Set priority level

3. **View Dashboard** → `/dashboard/lab`
   - See active demand requests
   - View matched restaurants on map
   - Track pickups

## 🌍 Environmental Impact

- **Waste Reduction**: Diverts shells from landfills
- **Carbon Savings**: Reduces transportation emissions through local matching
- **Circular Economy**: Creates value from waste
- **Sustainable Research**: Enables biomaterial innovation

## 🔮 Future Enhancements

- [ ] User authentication with sessions
- [ ] Email notifications for new matches
- [ ] Pickup scheduling calendar
- [ ] Quality ratings and reviews
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for monitoring
- [ ] Payment/credit system
- [ ] Multi-language support
- [ ] Blockchain-based tracking
- [ ] Carbon footprint calculator

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the circular economy movement
- Built for sustainable seafood and biomaterial research
- Thanks to all restaurants and labs participating in the beta

## 📧 Contact

- Website: [shellcycle.com](https://shellcycle.com) (coming soon)
- Email: info@shellcycle.com
- GitHub: [@shellcycle](https://github.com/shellcycle)

---

**Made with 💚 for a sustainable future**
