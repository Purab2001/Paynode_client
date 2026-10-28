# PayNode web app

React 19 + Vite, Tailwind CSS v4, TanStack Query, Firebase Auth, Stripe Payment Element, Socket.IO client.

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:5173
npm test
npm run build                # outputs dist/
```

Hosted on Firebase Hosting (`firebase.json`, site `paynode-2025`): `npm run build && firebase deploy --only hosting`.
Needs the API (`Paynode_server`) and chat server (`Paynode_realtime`) running; set `VITE_API_URL` and `VITE_REALTIME_URL`.
