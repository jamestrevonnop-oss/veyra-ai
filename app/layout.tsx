import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Veyra — AI developer console",
  description: "Build with fast, reliable AI models through the Veyra API.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
