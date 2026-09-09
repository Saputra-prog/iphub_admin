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
  title_id: string
  title_en: string
  category_id: string
  category_en: string
  description_id?: string
  description_en?: string
  icon?: string | LucideIcon
}

interface ServiceCategory {
  categoryName: string
  items: ServiceItem[]
}

const CATEGORY_LIST = [
  'Kantor Virtual',
  'Pendirian Perusahaan',
  'Layanan Perizinan Usaha Standar',
  'Layanan Keuangan, Konsultasi & Hukum',
  'Fasilitas'
]

const ICON_MAP: Record<string, LucideIcon> = {
  'Kantor Virtual': Building2,
  'Virtual Office': Building2,

  'Perseroan Terbatas (PMA)': Building,
  'Perseroan Terbatas (Lokal)': UserCheck,

  'Yayasan': Landmark,
  'Foundation': Landmark,

  'Perusahaan Perorangan': UserCheck,
  'Pendirian Perusahaan': Building,

  'Layanan Perizinan Usaha Standar': FileCheck2,

  'Pembukuan': BookOpenCheck,
  'Bookkeeping': BookOpenCheck,

  'Layanan Audit': FileSearch,
  'Konsultasi Pajak': Receipt,
  'VISA & KITAS': Globe,
  'Merek & Paten': Award,

  'Kafe & Coffee Roastery': Coffee,
  'Ruang Meeting': Users,
  'Private Office': Briefcase
}

export default function AdminDesk() {
  const [openId, setOpenId] = useState<string | number | null>(null)
  const [servicesCategories, setServicesCategories] = useState<ServiceCategory[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<number | string | null>(null)
  const [titleId, setTitleId] = useState('')
  const [categoryId, setCategoryId] = useState(CATEGORY_LIST[0])
  const [descriptionId, setDescriptionId] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  const fetchServices = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${API_URL}/api/serviceModel`)

      if (res.data?.success) {
        const rawData: ServiceItem[] = Array.isArray(res.data.data)
          ? res.data.data
          : []

        const groupedCategories: ServiceCategory[] = []

        CATEGORY_LIST.forEach((category) => {
          const filteredItems = rawData.filter(
            (item) => item.category_id === category
          )

          if (filteredItems.length > 0) {
            groupedCategories.push({
              categoryName: category,
              items: filteredItems
            })
          }
        })

        const remainingItems = rawData.filter(
          (item) => !CATEGORY_LIST.includes(item.category_id)
        )

        const remainingGroups = new Map<string, ServiceItem[]>()

        remainingItems.forEach((item) => {
          const category = item.category_id || 'Lainnya'

          if (!remainingGroups.has(category)) {
            remainingGroups.set(category, [])
          }

          remainingGroups.get(category)!.push(item)
        })

        remainingGroups.forEach((items, categoryName) => {
          groupedCategories.push({
            categoryName,
            items
          })
        })

        setServicesCategories(groupedCategories)
      } else {
        setServicesCategories([])
      }
    } catch (err) {
      console.error('Error fetching services:', err)
      setServicesCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const toggleCard = (id: string | number) => {
    setOpenId((current) => (current === id ? null : id))
  }

  const handleOpenAdd = () => {
    setEditId(null)
    setTitleId('')
    setCategoryId(CATEGORY_LIST[0])
    setDescriptionId('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (
    e: React.MouseEvent,
    item: ServiceItem
  ) => {
    e.stopPropagation()

    setEditId(item.id)
    setTitleId(item.title_id || '')
    setCategoryId(item.category_id || CATEGORY_LIST[0])
    setDescriptionId(item.description_id || '')
    setIsModalOpen(true)
  }

  const handleDelete = async (
    e: React.MouseEvent,
    id: number | string
  ) => {
    e.stopPropagation()

    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/api/serviceModel/${id}`)
      await fetchServices()
    } catch (err) {
      console.error('Error deleting service:', err)
      alert('Gagal menghapus data!')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titleId.trim()) {
      alert('Judul wajib diisi!')
      return
    }

    if (!categoryId.trim()) {
      alert('Kategori wajib dipilih!')
      return
    }

    try {
      const payload = {
        title_id: titleId.trim(),
        category_id: categoryId.trim(),
        description_id: descriptionId.trim()
      }

      if (editId !== null) {
        await axios.put(
          `${API_URL}/api/serviceModel/${editId}`,
          payload
        )
      } else {
        await axios.post(
          `${API_URL}/api/serviceModel`,
          payload
        )
      }

      setIsModalOpen(false)
      setEditId(null)
      setTitleId('')
      setCategoryId(CATEGORY_LIST[0])
      setDescriptionId('')

      await fetchServices()
    } catch (err: any) {
      console.error('Error menyimpan service:', err)
      console.error('Response:', err.response?.data)

      alert(
        err.response?.data?.message ||
        'Gagal menyimpan data!'
      )
    }
  }

  const renderCard = (service: ServiceItem) => {
    const itemId = service.id
    const isOpen = openId === itemId

    const title =
      service.title_id ||
      service.title_en ||
      'Tanpa Judul'

    const description =
      service.description_id ||
      service.description_en ||
      'Tidak ada deskripsi tambahan.'

    let IconComponent: LucideIcon = Building2

    if (typeof service.icon === 'function') {
      IconComponent = service.icon as LucideIcon
    } else if (
      typeof service.icon === 'string' &&
      ICON_MAP[service.icon]
    ) {
      IconComponent = ICON_MAP[service.icon]
    } else if (ICON_MAP[service.title_id]) {
      IconComponent = ICON_MAP[service.title_id]
    } else if (ICON_MAP[service.title_en]) {
      IconComponent = ICON_MAP[service.title_en]
    } else if (ICON_MAP[service.category_id]) {
      IconComponent = ICON_MAP[service.category_id]
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

              <h3
                className={`font-bold text-xs sm:text-sm leading-snug ${
                  isOpen
                    ? 'text-amber-900'
                    : 'text-gray-800'
                }`}
              >
                {title}
              </h3>
            </div>

            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-transform duration-200 ${
                isOpen
                  ? 'bg-amber-200/70 text-amber-800 rotate-180'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-amber-100 group-hover:text-amber-700'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {isOpen && (
            <div className="mt-3 text-xs text-gray-600 border-t border-amber-200/60 pt-3">
              <p className="leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>

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
    if (items.length === 0) {
      return null
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-start">
        {items.map((item) => renderCard(item))}
      </div>
    )
  }

  const totalServices = servicesCategories.reduce(
    (total, group) => total + group.items.length,
    0
  )

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 pb-28 font-sans space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
          <Layers className="text-amber-500 stroke-[2.2]" />
          Kelola Layanan Bisnis
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Kelola daftar fasilitas, lisensi, dan penasihat layanan bisnis Anda.
        </p>
      </div>

      <div className="relative border border-gray-200 rounded-3xl p-6 md:p-8 pt-10 bg-gray-50/50 shadow-2xs">
        <div className="absolute -top-3.5 left-6">
          <span className="px-3.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full select-none shadow-2xs">
            Service Management
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-sm text-gray-500">
              Memuat data layanan...
            </p>
          </div>
        ) : servicesCategories.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-sm text-gray-500">
              Belum ada data layanan.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {servicesCategories.map((group) => (
              <div
                key={group.categoryName}
                className="flex flex-col items-center w-full"
              >
                <div className="mb-4">
                  <span className="px-4 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full shadow-2xs select-none">
                    {group.categoryName}
                  </span>
                </div>

                {renderRow(group.items)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-400">
        Total layanan: {totalServices}
      </div>

      <button
        type="button"
        onClick={handleOpenAdd}
        className="fixed bottom-8 right-8 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer z-40 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Tambah Layanan</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                {editId !== null ? (
                  <Pencil size={16} className="text-amber-500" />
                ) : (
                  <Plus size={18} className="text-amber-500" />
                )}

                {editId !== null
                  ? 'Edit Layanan'
                  : 'Tambah Layanan Baru'}
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Kategori
                </label>

                <select
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value)
                  }
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 bg-white"
                >
                  {CATEGORY_LIST.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Judul Bahasa Indonesia
                </label>

                <input
                  type="text"
                  value={titleId}
                  onChange={(e) =>
                    setTitleId(e.target.value)
                  }
                  required
                  placeholder="Masukkan judul bahasa Indonesia..."
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Deskripsi Bahasa Indonesia
                </label>

                <textarea
                  value={descriptionId}
                  onChange={(e) =>
                    setDescriptionId(e.target.value)
                  }
                  rows={4}
                  placeholder="Tuliskan deskripsi bahasa Indonesia..."
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400 resize-none"
                />
              </div>

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