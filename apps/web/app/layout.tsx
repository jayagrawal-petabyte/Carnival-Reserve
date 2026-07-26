import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Carnival Reserve — Currency Tracking & Passport',
  description: 'Currency-tracking web application for college festival carnival.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-grid-paper antialiased">
        {children}
      </body>
    </html>
  );
}
