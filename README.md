# Frontend (Next.js) - SaaS Customer Portal

Modern, animated customer portal UI for multi-platform content distribution. Built with Next.js 15, TypeScript, Tailwind CSS, and AOS animations.

## 🚀 Quick Start

```bash
cd frontend
pnpm install
pnpm dev
```

- App runs at **http://localhost:3000**
- Expects Gateway at `http://localhost:4000` (configurable)
- WebSocket at `ws://localhost:4000` (configurable)

## ✨ Features

### Core Functionality
- 🎧 **Platform Management** - Connect up to 10 platforms (YouTube, Spotify, Apple Music, Deezer, SoundCloud, TuneIn, Amazon Music, iHeartRadio, Audiomack, Podchaser)
- 📤 **Upload Scheduler** - Queue content for automated distribution
- 📊 **Real-time Dashboard** - Live metrics and job tracking
- 💳 **Billing & Plans** - Stripe-powered subscription management
- 👤 **User Authentication** - JWT-based auth with signup/login

### UI/UX Enhancements
- ✨ **AOS Animations** - Smooth scroll-triggered animations throughout
- 🎨 **Modern Design** - Montserrat typography, brand colors, rounded cards
- 📱 **Fully Responsive** - Mobile-first design
- 🌙 **Dark Mode Toggle** - Theme switcher with localStorage persistence
- 🎯 **Empty States** - Engaging illustrations when no data
- ⏳ **Progress Indicators** - Real-time circular progress for jobs
- 🎓 **Onboarding Tour** - 4-step welcome modal for new users
- 🔄 **WebSocket Updates** - Live job status via Socket.IO

### Pages & Routes

**Public**
- `/` - Landing page with hero, features, pricing
- `/login` - User authentication
- `/signup` - User registration
- `/legal` - Privacy policy, terms, cookies, disclaimer
- `/support` - Contact, help topics, trust & safety
- `/billing-policy` - Billing info and terms

**Authenticated**
- `/dashboard` - Overview with metrics cards and quick actions
- `/channels` - Platform connection management with 10-platform grid
- `/uploads` - Upload scheduler with job tracking table
- `/monetization` - Pricing plans and subscription management
- `/status/[jobId]` - Individual job status details

**Admin**
- `/admin/dashboard` - Admin analytics
- `/admin/users` - User management

## 🎨 Design System

### Typography
- **Font**: Montserrat, sans-serif
- **H1**: 42-48px bold
- **H2**: 30-36px
- **Body**: 18-20px
- **Buttons**: 20-24px bold

### Colors
- **Primary**: `#2D89FF` (Blue) - Main CTAs, highlights
- **Secondary**: `#FFB400` (Gold) - Connect buttons, accents
- **Accent**: `#4CAF50` (Green) - Success states, upgrade
- **Background**: `#F5F5F5` (Light Gray)
- **Additional**: `#6366F1` (Indigo) for metrics

### Components
- **Cards**: `rounded-2xl`, `shadow-md`, `hover:shadow-lg`
- **Buttons**: `rounded-lg`, `hover:brightness-95`
- **Animations**: AOS with fade-up, zoom-in, staggered delays
- **Spacing**: Consistent `p-4 md:p-6`, `gap-4`

## 📦 Component Library

### Reusable Components

**EmptyState** (`src/components/EmptyState.tsx`)
```tsx
<EmptyState
  icon="🎧"
  title="No Channels Connected"
  description="Connect your first platform..."
  actionLabel="Get Started"
  onAction={() => handleAction()}
/>
```

**CircularProgress** (`src/components/CircularProgress.tsx`)
```tsx
<CircularProgress 
  progress={75} 
  size={48} 
  strokeWidth={4} 
  color="#2D89FF" 
/>
```

**OnboardingModal** (`src/components/OnboardingModal.tsx`)
```tsx
// Auto-shows on first visit
<OnboardingModal />
```

**ThemeToggle** (`src/components/ThemeToggle.tsx`)
```tsx
// Sun/moon icon toggle
<ThemeToggle />
```

**CookieConsent** (`src/components/CookieConsent.tsx`)
```tsx
// GDPR-compliant banner
<CookieConsent />
```

### Layout Components
- **AppShell** - Dashboard layout with sidebar nav
- **Header** - Landing page header with mobile menu
- **Footer** - Legal links and contact info

## 🔧 Configuration

### Environment Variables

Create `.env.local` (optional - has defaults):

```env
# Gateway endpoints
NEXT_PUBLIC_GATEWAY_HTTP_URL=http://localhost:4000
NEXT_PUBLIC_GATEWAY_WS_URL=ws://localhost:4000

# Supabase (optional for file uploads)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Defaults**:
- Gateway HTTP: `http://localhost:4000`
- Gateway WS: `ws://localhost:4000`
- Supabase: Falls back to dummy URLs if not configured

### Config Files
- `src/lib/config.ts` - Gateway URL configuration
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/api.ts` - Axios instance with JWT interceptor
- `src/lib/auth.ts` - Auth helpers and token management
- `src/lib/socket.ts` - Socket.IO client setup

## 🔐 Authentication

**Flow**:
1. User signs up/logs in via `/signup` or `/login`
2. Gateway issues JWT stored in `localStorage` key `gateway_jwt`
3. API requests include `Authorization: Bearer <token>` header
4. WebSocket connects with JWT in auth handshake

**Auth Helpers** (`src/lib/auth.ts`):
```tsx
saveToken(token)       // Store JWT
getToken()             // Retrieve JWT
clearToken()           // Sign out
getUserName()          // Get user display name
getRole()              // Get user role (admin/user)
isAdmin()              // Check admin status
```

## 📡 Real-time Updates

**WebSocket Events** (Socket.IO):
- `job:update` - Job progress updates (1-99%)
- `job:done` - Job completion (100%)
- `job:failed` - Job failure notification

**Usage** (`src/lib/socket.ts`):
```tsx
const socket = getSocket();
socket.on('job:update', (payload) => {
  // Update UI with payload.jobId, payload.status, payload.progress
});
```

## 🎬 Animations

**AOS (Animate On Scroll)** - Configured in `src/app/AOSProvider.tsx`

**Common Patterns**:
```tsx
data-aos="fade-up"           // Fade in while moving up
data-aos-delay="100"         // Delay 100ms
data-aos="zoom-in"           // Scale and fade in
data-aos="fade-left"         // Fade in from right
```

**Staggered Cards**:
```tsx
{items.map((item, idx) => (
  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50}>
    {/* Content */}
  </div>
))}
```

## 📤 Upload Flow

1. **Schedule Upload Page** (`/uploads`):
   - Select connected channel
   - Enter asset URL or upload file
   - Set title, description, platform, schedule time
   
2. **File Upload Options**:
   - **Paste URL**: Direct link to hosted file
   - **Upload File**: Click "Upload" button
     - If Supabase configured: Uploads to Supabase Storage
     - Otherwise: Returns fallback URL for testing

3. **Job Tracking**:
   - Real-time progress via WebSocket
   - Circular progress indicators
   - Status badges (Queued/Running/Succeeded/Failed)
   - Click job ID to view details at `/status/[jobId]`

## 🎧 Platform Connection

**Supported Platforms** (10 total):
1. YouTube
2. Spotify
3. Apple Music
4. Deezer
5. SoundCloud
6. TuneIn
7. Amazon Music
8. iHeartRadio
9. Audiomack
10. Podchaser

**Connection Flow**:
1. Click "+ Add Platform" on Channels page
2. Select platform from dropdown
3. Enter Channel URL/ID
4. Optional: Enter display name
5. System validates and stores connection

**Plan Limits**:
- **Free**: 2 platforms
- **Pro**: 5 platforms
- **Agency**: 10 platforms

## 💳 Billing & Plans

**Tiers**:
| Plan | Price | Uploads | Platforms | Features |
|------|-------|---------|-----------|----------|
| Free | $0/mo | 2/mo | 2 | Basic features, watermark |
| Pro | $19/mo | 50/mo | 5 | No watermark, priority support |
| Agency | $49/mo | Unlimited | 10 | All features, priority support |

**Stripe Integration**:
- Checkout: Creates Stripe session, redirects to payment
- Portal: Opens Stripe customer portal for management
- Webhooks: Auto-updates plan on subscription change

## 🌙 Dark Mode

**Implementation**:
- Toggle component in AppShell header
- Adds `dark` class to `<html>` element
- Persists preference in localStorage
- Ready for Tailwind `dark:` utilities

**Future Enhancement**:
Apply dark variants across components:
```tsx
className="bg-white dark:bg-gray-800 text-black dark:text-white"
```

## 🎓 Onboarding

**4-Step Tour**:
1. **Welcome** - Platform introduction
2. **Connect Platforms** - CTA to `/channels`
3. **Upload & Localize** - CTA to `/uploads`
4. **Track Progress** - CTA to `/dashboard`

**Features**:
- Auto-shows after 1 second on first visit
- Progress dots indicator
- Skip or step through
- Stores completion in localStorage (`onboarding_completed`)

## 📱 Responsive Design

**Breakpoints** (Tailwind):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile Optimizations**:
- Collapsible navigation
- Stacked cards on mobile
- Touch-friendly buttons
- Responsive tables with horizontal scroll

## 🧪 Development

**Commands**:
```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # Run ESLint
```

**Tech Stack**:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: AOS (Animate On Scroll)
- **HTTP**: Axios
- **WebSocket**: Socket.IO Client
- **State**: SWR (for data fetching)
- **Icons**: Material-UI Icons
- **Forms**: Native HTML5 with validation

## 🔒 Security

- JWT tokens in localStorage (HttpOnly not available for client-side)
- CORS configured to allow Gateway origin
- XSS protection via React's built-in escaping
- CSRF not needed (JWT-based, no cookies)
- All API calls over HTTPS in production

## 🚀 Deployment (Vercel)

**1. Push Frontend to GitHub**
```bash
git add frontend/
git commit -m "Add frontend"
git push
```

**2. Import Project on Vercel**
- Go to https://vercel.com/new
- Import your GitHub repository
- Configure:
  - **Framework Preset**: Next.js
  - **Root Directory**: `frontend`
  - **Build Command**: `pnpm build` (auto-detected)
  - **Output Directory**: `.next` (auto-detected)

**3. Add Environment Variables**
In Vercel dashboard, add:
```env
NEXT_PUBLIC_GATEWAY_HTTP_URL=https://saas-gateway.onrender.com
NEXT_PUBLIC_GATEWAY_WS_URL=wss://saas-gateway.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**4. Deploy**
Click "Deploy" - Vercel will build and deploy automatically

**5. Update Gateway Environment**
Update `FRONTEND_BASE_URL` in Render to point to your Vercel URL:
```
FRONTEND_BASE_URL=https://your-app.vercel.app
```

**6. Custom Domain (Optional)**
- Add domain in Vercel dashboard
- Configure DNS records
- SSL automatically provisioned

### Rollback
Vercel keeps all deployments - click any previous deployment and click "Promote to Production"

## 📚 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Authenticated routes
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── channels/      # Platform management
│   │   │   ├── uploads/       # Upload scheduler
│   │   │   ├── monetization/  # Billing & plans
│   │   │   └── status/        # Job details
│   │   ├── admin/             # Admin routes
│   │   ├── legal/             # Legal pages
│   │   ├── support/           # Support pages
│   │   ├── billing-policy/    # Billing policy
│   │   ├── login/             # Auth pages
│   │   ├── signup/
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── layout/            # AppShell, Header, Footer
│   │   ├── ui/                # Skeleton, base components
│   │   ├── EmptyState.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── OnboardingModal.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── CookieConsent.tsx
│   └── lib/                   # Utilities
│       ├── api.ts             # Axios client
│       ├── auth.ts            # Auth helpers
│       ├── socket.ts          # Socket.IO client
│       ├── config.ts          # Environment config
│       └── supabase.ts        # Supabase client
├── public/                    # Static assets
└── package.json
```

## 🐛 Troubleshooting

**Cannot connect to Gateway**:
- Ensure Gateway is running on port 4000
- Check `NEXT_PUBLIC_GATEWAY_HTTP_URL` in `.env.local`
- CORS must allow frontend origin

**WebSocket not connecting**:
- Verify `NEXT_PUBLIC_GATEWAY_WS_URL` is correct
- Check JWT is stored in localStorage
- Gateway must initialize Socket.IO

**Uploads not working**:
- If no Supabase: Uses fallback URLs (works in dev)
- If Supabase: Verify URL, key, and bucket name
- Check browser console for errors

**Animations not playing**:
- AOS initializes in `AOSProvider`
- Ensure `data-aos` attributes are on elements
- Check browser console for errors

## 📄 License

Proprietary - All rights reserved

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [AOS](https://michalsnik.github.io/aos/)
- [Socket.IO](https://socket.io/)
- [SWR](https://swr.vercel.app/)
- [Material-UI Icons](https://mui.com/material-ui/material-icons/)
