import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Dashboard - Eight Hands Work",
  description: "Admin dashboard for Eight Hands Work luxury furniture",
}

export default function AdminLayout({ children }) {
  return <div className={inter.className}>{children}</div>
}
