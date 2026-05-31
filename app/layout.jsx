import './globals.css';

export const metadata = {
  title: 'Summer Adventures ELO',
  description: 'Strava for summer adventures — plan trips, prove them, climb the leaderboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
