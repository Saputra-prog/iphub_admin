'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Star, 
  Pencil, 
  Trash2, 
  Plus, 
  Upload, 
  User, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'

interface TestimonialItem {
  id: number | string
  name: string
  rating: number
  comment: string
  profileImage?: string
}

export default function AdminTestimonialPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<number | string | null>(null)

  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/testimonialModel`)
      if (res.data?.success) {
        setTestimonials(res.data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleOpenAdd = () => {
    setEditId(null)
    setName('')
    setRating(5)
    setComment('')
    setSelectedFile(null)
    setPreviewImage('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (e: React.MouseEvent, item: TestimonialItem) => {
    e.stopPropagation()
    setEditId(item.id)
    setName(item.name)
    setRating(item.rating)
    setComment(item.comment)
    setSelectedFile(null)
    setPreviewImage(item.profileImage ? `${API_URL}${item.profileImage}` : '')
    setIsModalOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation()
    if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      try {
        await axios.delete(`${API_URL}/api/testimonialModel/${id}`)
        fetchTestimonials()
      } catch (err) {
        alert('Gagal menghapus data!')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('rating', rating.toString())
      formData.append('comment', comment)
      if (selectedFile) {
        formData.append('profileImage', selectedFile)
      }

      if (editId) {
        await axios.put(`${API_URL}/api/testimonialModel/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await axios.post(`${API_URL}/api/testimonialModel`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      setIsModalOpen(false)
      fetchTestimonials()
    } catch (err) {
      alert('Gagal menyimpan data!')
    }
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 3) : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= testimonials.length - 3 ? 0 : prev + 1))
  }

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < count ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3)

  return (
    <div className="bg-white min-h-screen p-8 relative">
      <h1 className="font-bold text-2xl flex justify-center gap-2 mb-2">
        <span className="text-amber-600">Komentar</span>
        <span className="text-gray-600">Klien Kami</span>
      </h1>
      <p className="text-center text-sm text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed">
        Komentar dari klien yang telah menggunakan layanan kami sebagai wujud profesionalisme dan kualitas kerja.
      </p>

      <div className="relative max-w-6xl mx-auto border border-amber-200 rounded-3xl p-6 md:p-8 pt-10 bg-amber-50/20">
        <div className="absolute -top-3.5 left-6">
          <span className="px-3.5 py-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 rounded-full select-none cursor-default shadow-sm">
            Testimonial Management
          </span>
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={testimonials.length <= 3}
            className="w-10 h-10 rounded-full border border-amber-300 bg-white flex items-center justify-center text-amber-600 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {visibleTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-amber-300 transition-all duration-300"
              >
                <div>
                  <div className="flex gap-1 mb-3">{renderStars(item.rating)}</div>
                  <p className="text-xs text-gray-600 leading-relaxed italic mb-4">
                    "{item.comment}"
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    {item.profileImage ? (
                      <img
                        src={`${API_URL}${item.profileImage}`}
                        alt={item.name}
                        className="w-9 h-9 rounded-full object-cover border border-amber-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <span className="font-semibold text-xs text-gray-800">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => handleOpenEdit(e, item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={testimonials.length <= 3}
            className="w-10 h-10 rounded-full border border-amber-300 bg-white flex items-center justify-center text-amber-600 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={handleOpenAdd}
        className="fixed bottom-8 right-8 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editId ? 'Edit Komentar Klien' : 'Tambah Komentar Klien'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Klien
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rating Bintang (1 - 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Isi Komentar
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  required
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Foto Profile
                </label>
                <div className="flex items-center gap-4">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border border-amber-300 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 text-xs font-semibold text-gray-600">
                    <Upload className="w-4 h-4 text-amber-500" />
                    Pilih foto...
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}