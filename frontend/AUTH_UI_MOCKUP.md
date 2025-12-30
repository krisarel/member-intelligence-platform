# Unified Auth Page - UI Mockup

## Visual Design Preview

### Desktop View (1280px+)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Background: Gradient blobs - purple/teal like current pages]  │
│                                                                 │
│                    ┌─────────────────────┐                      │
│                    │   [W3 Logo Icon]    │                      │
│                    │   WiW3CH Platform   │                      │
│                    └─────────────────────┘                      │
│                                                                 │
│              ┌─────────────────────────────────┐                │
│              │  ┌──────────┬──────────┐       │                │
│              │  │ Sign In  │ Sign Up  │       │  ← Tabs        │
│              │  └──────────┴──────────┘       │                │
│              │                                 │                │
│              │  [Active Tab Content]           │                │
│              │                                 │                │
│              │  Email: [________________]      │                │
│              │                                 │                │
│              │  Password: [________________]   │                │
│              │                                 │                │
│              │  [Sign In Button - Full Width]  │                │
│              │                                 │                │
│              │  ─────── Or continue with ───── │                │
│              │                                 │                │
│              │  [LinkedIn Button]              │                │
│              │                                 │                │
│              │  Demo: maya@example.com         │                │
│              │                                 │                │
│              └─────────────────────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tab States

#### Sign In Tab (Active)
```
┌─────────────────────────────────────┐
│  ┏━━━━━━━━━━┓┌──────────┐          │
│  ┃ Sign In  ┃│ Sign Up  │          │  ← Active tab highlighted
│  ┗━━━━━━━━━━┛└──────────┘          │
│                                     │
│  Welcome back                       │
│  Enter your email to access the     │
│  member platform                    │
│                                     │
│  Email                              │
│  [maya@example.com____________]     │
│                                     │
│  Try maya@example.com for VIP demo  │
│                                     │
│  [Sign In - Gradient Button]        │
│                                     │
│  ─────── Or continue with ─────     │
│                                     │
│  [🔗 Sign in with LinkedIn]         │
│                                     │
└─────────────────────────────────────┘
```

#### Sign Up Tab (Active)
```
┌─────────────────────────────────────┐
│  ┌──────────┐┏━━━━━━━━━━┓          │
│  │ Sign In  │┃ Sign Up  ┃          │  ← Active tab highlighted
│  └──────────┘┗━━━━━━━━━━┛          │
│                                     │
│  Join the Community                 │
│  Create your profile to connect     │
│  with women in Web3                 │
│                                     │
│  Full Name                          │
│  [Jane Doe_________________]        │
│                                     │
│  Email                              │
│  [jane@example.com_________]        │
│                                     │
│  Primary Industry                   │
│  [Select industry ▼________]        │
│                                     │
│  [Create Account - Gradient Button] │
│                                     │
│  ─────── Or register with ─────     │
│                                     │
│  [🔗 Sign up with LinkedIn]         │
│                                     │
└─────────────────────────────────────┘
```

## Key Design Features

### 1. Tab Component (shadcn/ui Tabs)
- **Active State**: Bold text, underline, or highlighted background
- **Inactive State**: Muted text, clickable
- **Smooth Transition**: Content fades in/out when switching tabs
- **Keyboard Accessible**: Arrow keys to switch tabs

### 2. Visual Consistency
- Same background gradient effects as current login/register pages
- Same card styling with backdrop blur
- Same color scheme (purple #7507c5 to teal #00d6b9)
- Same button gradients and hover effects

### 3. Responsive Behavior
```
Desktop (1024px+):  Card width: 500px, centered
Tablet (768px):     Card width: 90%, centered
Mobile (< 768px):   Card width: 95%, full height
```

### 4. URL Query Parameters
```
/auth                    → Defaults to Sign In tab
/auth?mode=signin        → Opens Sign In tab
/auth?mode=signup        → Opens Sign Up tab
```

When user switches tabs, URL updates automatically:
- Click "Sign Up" tab → URL becomes `/auth?mode=signup`
- Click "Sign In" tab → URL becomes `/auth?mode=signin`

### 5. Animation & Transitions
```typescript
// Tab content fade transition
<TabsContent value="signin" className="animate-in fade-in-50 duration-300">
  {/* Sign in form */}
</TabsContent>

<TabsContent value="signup" className="animate-in fade-in-50 duration-300">
  {/* Sign up form */}
</TabsContent>
```

## Component Structure

```typescript
// Simplified structure
<div className="min-h-screen bg-slate-950">
  {/* Background effects */}
  
  <Card className="max-w-md mx-auto">
    <CardHeader>
      <Logo />
    </CardHeader>
    
    <Tabs defaultValue={mode} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <SignInForm />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  </Card>
</div>
```

## User Interaction Flow

### Scenario 1: User clicks "Sign In" from landing page
1. Navigate to `/auth?mode=signin`
2. Page loads with Sign In tab active
3. User fills email and clicks "Sign In"
4. Redirects to `/dashboard`

### Scenario 2: User clicks "Sign Up" from landing page
1. Navigate to `/auth?mode=signup`
2. Page loads with Sign Up tab active
3. User fills form and clicks "Create Account"
4. Redirects to `/dashboard`

### Scenario 3: User on Sign In wants to Sign Up
1. Currently on `/auth?mode=signin`
2. Clicks "Sign Up" tab
3. URL updates to `/auth?mode=signup`
4. Content smoothly transitions to sign up form
5. No page reload, instant switch

### Scenario 4: Legacy URL access
1. User navigates to `/login`
2. Automatic redirect to `/auth?mode=signin`
3. Sign In tab is active
4. User continues normally

## Comparison: Current vs Proposed

### Current State
```
Landing Page
    ├─ Click "Sign In" → AuthModal opens (modal)
    ├─ Click "Sign Up" → AuthModal opens (modal)
    ├─ Navigate to /login → Full page
    └─ Navigate to /register → Full page

Issues:
❌ 3 different implementations
❌ Modal can be confusing
❌ Code duplication
❌ Maintenance overhead
```

### Proposed State
```
Landing Page
    ├─ Click "Sign In" → /auth?mode=signin (full page)
    └─ Click "Sign Up" → /auth?mode=signup (full page)

Legacy URLs (backward compatible):
    ├─ /login → Redirects to /auth?mode=signin
    └─ /register → Redirects to /auth?mode=signup

Benefits:
✅ Single implementation
✅ No modal confusion
✅ Easy to maintain
✅ Better UX with tabs
✅ Backward compatible
```

## Technical Implementation Notes

### Dependencies (Already Available)
- `@radix-ui/react-tabs` (via shadcn/ui)
- `next/navigation` for routing
- `framer-motion` for animations (optional)

### State Management
```typescript
// URL query parameter handling
const searchParams = useSearchParams();
const mode = searchParams.get('mode') || 'signin';

// Tab change handler
const handleTabChange = (value: string) => {
  router.push(`/auth?mode=${value}`);
};
```

### Form Validation
- Reuse existing validation logic from current login/register pages
- Consider adding React Hook Form for better validation
- Show inline error messages

## Questions for Review

1. **Tab Position**: Do you prefer tabs at the top (as shown) or would you like them in a different position?

2. **Default Tab**: Should `/auth` default to Sign In or Sign Up?

3. **Modal vs Full Page**: Are you comfortable removing the modal completely in favor of full-page navigation?

4. **LinkedIn OAuth**: Should this be prominent or secondary?

5. **Additional Fields**: For sign up, do you want to keep it minimal (name, email, industry) or add more fields?

6. **Password Field**: Current login page doesn't have password - should we add it or keep the simplified email-only flow?

7. **Branding**: Should we add more WiW3CH branding elements to the auth page?

## Next Steps

Once you approve this design:
1. Create `/app/auth/page.tsx` with tab implementation
2. Update landing page navigation
3. Convert legacy routes to redirects
4. Remove AuthModal component
5. Test all flows

Please review and let me know if you'd like any modifications to this design!