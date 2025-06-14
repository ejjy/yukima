# Yukima MVP - AI Skincare for Indian Women

A comprehensive skincare application built with React, TypeScript, and Supabase, designed specifically for Indian women aged 18-35.

## Features

- **Personalized Quiz**: Comprehensive skin assessment
- **AI Face Scan**: Advanced skin analysis (mock implementation)
- **Custom Routines**: Budget-friendly, personalized skincare routines
- **Dupe Finder**: Find affordable alternatives to expensive products
- **Ingredient Analysis**: Safety alerts and compatibility checks
- **Multi-language Support**: English and Hindi
- **PWA Ready**: Offline support and mobile optimization

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Authentication**: Supabase Auth
- **Deployment**: Vite build system
- **PWA**: Service worker with offline caching

## Database Schema

### Core Tables
- `user_profiles` - User preferences and skin data
- `user_routines` - Personalized skincare routines
- `scan_results` - AI face scan analysis results
- `products` - Product catalog with Indian brands
- `dupes` - Product alternatives and savings
- `ingredient_analysis_cache` - Ingredient safety data

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Environment variables configured

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd yukima-mvp
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your Supabase credentials
```

4. Run database migrations
```bash
# Apply migrations in Supabase dashboard or CLI
```

5. Seed the database
```bash
npm run seed
```

6. Start development server
```bash
npm run dev
```

## Data Migration

The application has been migrated from mock data to Supabase:

### Migration Process
1. **Database Setup**: Created tables for products, dupes, and ingredient alerts
2. **Service Layer**: Implemented service classes for data access
3. **Fallback Support**: Maintained mock data for offline/development use
4. **Error Handling**: Graceful fallback to mock data if Supabase fails

### Seeding Data
Run the seeding script to populate your Supabase database:

```bash
npm run seed
```

This will:
- Clear existing data
- Insert 40+ products from Indian brands
- Add 20+ product dupes with savings
- Populate ingredient safety alerts
- Verify data integrity

### Service Architecture
- `ProductService`: Handles product catalog and recommendations
- `DupeService`: Manages product alternatives and savings
- `IngredientService`: Provides ingredient safety analysis

## Key Features

### Product Recommendations
- Skin type compatibility filtering
- Concern-based matching
- Budget optimization
- Regional brand preference (Himalaya, Biotique, Mamaearth, etc.)

### Dupe Finder
- Search by product name or category
- Savings calculation
- Brand alternatives
- Best deals highlighting

### Ingredient Analysis
- Safety risk assessment
- Skin type compatibility
- Alternative suggestions
- Personalized warnings

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Caching**: Supabase queries cached appropriately
- **Fallback**: Mock data ensures app works offline
- **PWA**: Service worker for offline functionality
- **Mobile First**: Optimized for mobile devices

## Security & Privacy

- **RLS Policies**: Row-level security on all tables
- **Data Encryption**: Supabase handles encryption at rest
- **Privacy Controls**: User consent and data deletion
- **Secure Auth**: Supabase authentication system

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: For seeding (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.