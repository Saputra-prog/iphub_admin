'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useState } from "react"
import { Menu, X, LayoutDashboard, Briefcase, Server, FileText, MessageSquare, Image as ImageIcon, MapPin, Lock } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const pathname = usePathname()

  const navLinks = [
    { href: "/Admin/home", label: "Home", icon: LayoutDashboard },
    { href: "/Admin/deskripsi", label: "Layanan Service", icon: Server },
    { href: "/Admin/bisnis", label: "Layanan Bisnis", icon: Briefcase },
    { href: "/Admin/berita", label: "Layanan Berita", icon: FileText },
    { href: "/Admin/komentar", label: "Komentar", icon: MessageSquare },
    { href: "/Admin/bannerPromo", label: "Promo Banner", icon: ImageIcon },
    { href: "/Admin/location", label: "Lokasi", icon: MapPin },
    { href: "/Admin/ubah", label: "Ubah Password", icon: Lock },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative", backgroundColor: "#f8fafc" }}>
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          display: sidebarOpen ? "block" : "none",
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
        }}
        className="md:hidden"
      />

      <aside
        style={{
          width: "260px",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          borderRight: "1px solid #1e293b",
        }}
        className={`transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #1e293b" }}>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "700", letterSpacing: "-0.01em", margin: 0, color: "#ffffff" }}>
              IPHUB <span style={{ color: "#f59e0b", fontWeight: "500", fontSize: "13px", display: "block" }}>Admin Portal</span>
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
            className="md:hidden hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", paddingRight: "4px" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", paddingLeft: "12px", marginBottom: "4px" }}>
            Menu Utama
          </span>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const isHovered = hoveredPath === link.href
            const IconComponent = link.icon
            let bgColor = "transparent"
            let textColor = "#94a3b8"

            if (isActive) {
              bgColor = "#f59e0b"
              textColor = "#ffffff"
            } else if (isHovered) {
              bgColor = "rgba(30, 41, 59, 0.7)"
              textColor = "#f1f5f9"
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                onMouseEnter={() => setHoveredPath(link.href)}
                onMouseLeave={() => setHoveredPath(null)}
                style={{
                  color: textColor,
                  backgroundColor: bgColor,
                  textDecoration: "none",
                  padding: "11px 14px",
                  borderRadius: "8px",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "13.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.15s ease-in-out",
                  boxShadow: isActive ? "0 4px 12px rgba(245, 158, 11, 0.25)" : "none",
                }}
              >
                <IconComponent size={18} style={{ opacity: isActive || isHovered ? 1 : 0.8 }} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }} className="md:ml-[260px]">
        <header
          style={{
            alignItems: "center",
            padding: "16px 24px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
          className="flex md:hidden shadow-xs"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", color: "#0f172a" }}
          >
            <Menu size={22} />
            <span style={{ fontWeight: "600", fontSize: "15px" }}>Menu Navigasi</span>
          </button>
        </header>

        <main style={{ flex: 1, padding: "24px", backgroundColor: "#f8fafc", width: "100%", boxSizing: "border-box" }} className="md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}