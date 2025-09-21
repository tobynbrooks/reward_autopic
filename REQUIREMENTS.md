1. Project Overview
This app is a rewards app. The users earn ‘tyres’. They get rewards and discounts for collecting tyres. 1 tyre relates to a £1 credit
At 5 tyres the points can be redeemed. (this is done manually when the user visits the business)
The user should receive tyres for completing tasks. Spending money on their car. Coming in for checks on their car. The structure of the rewards should resemble the starbucks incentive system
There will be a chat feature created using an operator user function in supabase 
Notifications can be sent to the users using api posts 
The user is able, upon download, to upload their name, email and car registration number. 
2. Technical Specifications
Mobile Front end (users): Expo / React Native (TypeScript) for iOS & Android.
Web Front end (operator/admin): Next.js (TypeScript) for the admin panel (list conversations, reply, basic analytics). Admin can also add and remove ‘tyres’ from the users account so they can redeem features.
Backend (single source of truth): Supabase (Postgres, Auth, Realtime, Storage) — holds users, conversations, messages, files; handles auth + realtime updates. Also stores current number of ‘tyre’ rewards each user has.
API layer for admin actions/notifications via Next.js API routes or Supabase Edge Functions.
Integrations: Push notifications (Expo push service) and any third-party APIs (e.g., moderation, analytics).
Admin flow: Mobile users create conversations → stored in Supabase. Operator logs into Next.js admin panel → reads/replies (as a support user or admin account).
Notifications can be triggered from the admin panel (calling a Next.js API route or a Supabase Edge Function).
Points are added using the admin panel only, there is no scan function to start with.
Ensure the calculator for the points (1 point/pound per tyre earned) works with a calculator function that is designed as a helper in a seperate file so it can be changed and that file is imported to a profile screen.

3. Feature Requirements
Core features are outlined above and in the user flow. Keep this basic it is an (MVP)
Nice-to-have features (post-MVP) - in the next phase the chat will need to be automated. There will also be features using the users camera where I need control. These don't need to be installed now, but don't impede future design.
We will also need, in the future, user analytics and possibly powerBI

4. User Experience Design
UI should be clean and simple. UX should be simple with not may buttons
The user experience is designed in the file call USER_FLOW.md
Wizard flow for onboarding: name → email → car reg → notifications opt-in.
Balance widget: current tyres + progress to next tier + CTA “Earn more”.
Earning feed (ledger entries) = instant gratification.

5. Style and design
Keep the number of pages to a minimum
Use the colours from the starbucks app. 
Use design and user flow features, when in doubt, from Starbucks
6. Technical Architecture Codebase
Use a wizard structure to the pages where possible to improve flow
Security considerations - make the app safe but also consider its MVP
Use helper functions when the code base gets too heavy, or long. The code should be clean and easy to read.


7. Deployment & DevOps

Phase 1 build the main app with blank spaces for the code that connects to the DB and any admin or APIs
Second stage we can build out the SB links and test
Monitoring and logging setup- this needs to be clear and easy to debug, especially during the texting phase 
8. Security
GDPR: clear lawful basis, privacy notice, data retention (esp. car regs), DSR (export/delete).
Auth: Supabase Auth with email-magic links or OAuth; enforce email verification.
Secrets: Edge Functions, not client, call third-party APIs.
Rate-limit: per-IP and per-user for award/redeem/message endpoints.
