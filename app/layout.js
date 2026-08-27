import "./globals.css";


export const metadata = {
  title: "CareerGraph",
  description: "A platform to help you track your career growth and development.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}