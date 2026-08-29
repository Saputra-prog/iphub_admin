"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: "/Admin/home", label: "Home" },
    { href: "/Admin/berita", label: "Berita" },
    { href: "/Admin/bisnis", label: "Bisnis" },
    { href: "/Admin/deskripsi", label: "Deskripsi" },
    { href: "/Admin/komentar", label: "Komentar" },
    { href: "/Admin/bannerPromo", label: "Banner" },
    { href: "/Admin/location", label: "Lokasi" },
    { href: "/Admin/ubah", label: "Ubah Password" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative", backgroundColor: "#f8fafc" }}>
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          display: sidebarOpen ? "block" : "none",
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 40,
        }}
        className="md:hidden"
      />

      <aside
        style={{
          width: "240px",
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
        }}
        className={`transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
            Admin Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
            className="md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              style={{ color: "#fff", textDecoration: "none", padding: "8px 12px", borderRadius: "4px" }}
              className="hover:bg-slate-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }} className="md:ml-[240px]">
        <header
          style={{
            alignItems: "center",
            padding: "15px 20px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
          className="flex md:hidden"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: "#1e293b" }}
          >
            <Menu size={24} />
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>Menu Admin</span>
          </button>
        </header>

        <main style={{ flex: 1, padding: "20px", backgroundColor: "#f8fafc", width: "100%", boxSizing: "border-box" }} className="md:p-[30px]">
          {children}
        </main>
      </div>
    </div>
  );
}