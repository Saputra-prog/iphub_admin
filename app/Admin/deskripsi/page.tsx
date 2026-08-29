'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Building2, 
  Building, 
  UserCheck, 
  Landmark, 
  FileCheck2, 
  BookOpenCheck, 
  FileSearch, 
  Receipt, 
  Globe, 
  Award, 
  Coffee, 
  Users, 
  Briefcase,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  X,
  Layers,
  LucideIcon
} from 'lucide-react'

interface ServiceItem {
  id: number | string
  title: string
  category: string
  description?: string
  icon?: string | LucideIcon
}

interface ServiceCategory {
  categoryName: string
  items: ServiceItem[]
}

const CATEGORY_LIST = [
  'General Corporate & Virtual Office',
  'Corporate Establishment',
  'Standard Business License Service',
  'Financial, Advisory & Legal Services',
  'Facilities'
]

const ICON_MAP: Record<string, LucideIcon> = {
  'Kantor Virtual': Building2,
  'Limited Liability Company (PMA)': Building,
  'Limited Liability Company (local)': UserCheck,
  'Foundation (Yayasan)': Landmark,
  'Individual Limited Liability Company': UserCheck,
  'Standard Business License Service': FileCheck2,
  'Book-keeping': BookOpenCheck,
  'Audit Service': FileSearch,
  'Tax Consulting Service': Receipt,
  'VISA & KITAS': Globe,
  'Trademark & Patent': Award,
  'Cafe & Coffee Roastery': Coffee,
  'Meeting Room': Users,
  'Private Office': Briefcase
}

export default function AdminDesk() {
  const [openId, setOpenId] = useState<string | number | null>(null)
  const [servicesCategories, setServicesCategories] = useState<ServiceCategory[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<number | string | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORY_LIST[0])
  const [description, setDescription] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/serviceModel`)
      if (res.data?.success) {
        const rawData: ServiceItem[] = res.data.data

        const groupedCategories: ServiceCategory[] = CATEGORY_LIST.map((catName) => {
          const filteredItems = rawData.filter((item) => item.category === catName)
          return {
            categoryName: catName,
            items: filteredItems
          }
        })

        setServicesCategories(groupedCategories)
      }
    } catch (err) {
      console.error('Error fetching services:', err)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const toggleCard = (id: string | number) => {
    setOpenId(openId === id ? null : id)
  }

  const handleOpenAdd = () => {
    setEditId(null)
    setTitle('')
    setCategory(CATEGORY_LIST[0])
    setDescription('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (e: React.MouseEvent, item: ServiceItem) => {
    e.stopPropagation()
    setEditId(item.id)
    setTitle(item.title)
    setCategory(item.category)
    setDescription(item.description || '')
    setIsModalOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation()
    if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      try {
        await axios.delete(`${API_URL}/api/serviceModel/${id}`)
        fetchServices()
      } catch (err) {
        alert('Gagal menghapus data!')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { title, category, description }

      if (editId) {
        await axios.put(`${API_URL}/api/serviceModel/${editId}`, payload)
      } else {
        await axios.post(`${API_URL}/api/serviceModel`, payload)
      }

      setIsModalOpen(false)
      fetchServices()
    } catch (err) {
      alert('Gagal menyimpan data!')
    }
  }

  const renderCard = (service: ServiceItem) => {
    const itemId = service.id
    const isOpen = openId === itemId

    let IconComponent: LucideIcon = Building2
    if (typeof service.icon === 'function' || typeof service.icon === 'object') {
      IconComponent = service.icon as LucideIcon
    } else if (typeof service.icon === 'string' && ICON_MAP[service.icon]) {
      IconComponent = ICON_MAP[service.icon]
    } else if (ICON_MAP[service.title]) {
      IconComponent = ICON_MAP[service.title]
    }

    return (
      <div
        key={itemId}
        onClick={() => toggleCard(itemId)}
        className={`group border rounded-2xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between w-full ${
          isOpen
            ? 'bg-amber-50/60 border-amber-300 shadow-sm'
            : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors shrink-0">
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h3 className={`font-bold text-xs sm:text-sm leading-snug truncate ${isOpen ? 'text-amber-900' : 'text-gray-800'}`}>
                {service.title}
              </h3>
            </div>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-transform duration-200 ${
                isOpen ? 'bg-amber-200/70 text-amber-800 rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-amber-100 group-hover:text-amber-700'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {isOpen && (
            <div className="mt-3 text-xs text-gray-600 border-t border-amber-200/60 pt-3 animate-in fade-in duration-150">
              <p className="leading-relaxed">{service.description || 'Tidak ada deskripsi tambahan.'}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={(e) => handleOpenEdit(e, service)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-amber-50 text-amber-700 border border-gray-200 hover:border-amber-200 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => handleDelete(e, service.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200 hover:border-rose-200 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
        </div>
      </div>
    )
  }

  const renderRow = (items: ServiceItem[]) => {
    if (items.length === 0) return null

    if (items.length === 1) {
      return (
        <div className="flex justify-center w-full">
          <div className="w-full md:w-[calc(33.333%-11px)]">
            {renderCard(items[0])}
          </div>
        </div>
      )
    }

    if (items.length === 2) {
      return (
        <div className="flex flex-col md:flex-row justify-center gap-4 w-full">
          <div className="w-full md:w-[calc(33.333%-11px)]">
            {renderCard(items[0])}
          </div>
          <div className="w-full md:w-[calc(33.333%-11px)]">
            {renderCard(items[1])}
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-start">
        {items.map(renderCard)}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 pb-28 font-sans space-y-6">
      
      {/* Header Halaman */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
          <Layers className="text-amber-500 stroke-[2.2]" /> Kelola Layanan Bisnis
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola daftar fasilitas, lisensi, dan penasihat layanan bisnis Anda.
        </p>
      </div>

      {/* Main Container */}
      <div className="relative border border-gray-200 rounded-3xl p-6 md:p-8 pt-10 bg-gray-50/50 shadow-2xs">
        <div className="absolute -top-3.5 left-6">
          <span className="px-3.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full select-none shadow-2xs">
            Service Management
          </span>
        </div>

        <div className="flex flex-col gap-10">
          {servicesCategories.map((group, groupIdx) => {
            if (group.items.length === 0) return null

            const firstRowItems = group.items.slice(0, 3)
            const secondRowItems = group.items.slice(3)

            return (
              <div key={groupIdx} className="flex flex-col items-center w-full">
                <div className="mb-4">
                  <span className="px-4 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full shadow-2xs select-none">
                    {group.categoryName}
                  </span>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  {renderRow(firstRowItems)}
                  {renderRow(secondRowItems)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={handleOpenAdd}
        className="fixed bottom-8 right-8 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer z-40 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Tambah Layanan</span>
      </button>

      {/* Modal / Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                {editId ? <Pencil size={16} className="text-amber-500" /> : <Plus size={18} className="text-amber-500" />}
                {editId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Kategori Service
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 bg-white"
                >
                  {CATEGORY_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Judul Service
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Masukkan nama layanan..."
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan deskripsi ringkas layanan..."
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Footer Modal */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}