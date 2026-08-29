'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { 
  Newspaper, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon 
} from 'lucide-react';

interface BeritaItem {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
}

export default function AdminBeritaPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    const cleanBase = API_URL.replace(/\/$/, '');
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${cleanBase}${cleanPath}`;
  };

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const response = await axios.get<BeritaItem[]>(`${API_URL}/api/berita`);
      setBeritaList(response.data || []);
    } catch (err) {
      console.error('Gagal mengambil data berita:', err);
      setStatusMessage({ text: 'Gagal memuat data berita dari server.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, [API_URL]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDate('');
    setContent('');
    setImageFile(null);
    setPreviewImage('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BeritaItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDate(item.date);
    setContent(item.content);
    setImageFile(null);
    setPreviewImage(getImageUrl(item.image));
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/berita/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setStatusMessage({ text: 'Berita berhasil diperbarui!', isError: false });
      } else {
        await axios.post(`${API_URL}/api/berita`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setStatusMessage({ text: 'Berita berhasil ditambahkan!', isError: false });
      }

      setIsModalOpen(false);
      fetchBerita();
    } catch (err) {
      console.error('Gagal menyimpan berita:', err);
      setStatusMessage({ text: 'Gagal menyimpan data berita.', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    try {
      await axios.delete(`${API_URL}/api/berita/${id}`);
      setStatusMessage({ text: 'Berita berhasil dihapus!', isError: false });
      fetchBerita();
    } catch (err) {
      console.error('Gagal menghapus berita:', err);
      setStatusMessage({ text: 'Gagal menghapus berita.', isError: true });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 pb-28 font-sans space-y-6">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
            <Newspaper className="text-amber-500 stroke-[2.2]" /> Kelola Berita & Kegiatan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tambah, sunting, atau hapus artikel serta informasi kegiatan terbaru perusahaan.
          </p>
        </div>
      </div>

      {/* Pesan Status Notifikasi */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
            statusMessage.isError
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {statusMessage.isError ? (
            <AlertCircle size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Daftar Berita */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          Memuat data berita...
        </div>
      ) : beritaList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <Newspaper size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium text-sm">Belum ada berita yang diterbitkan.</p>
          <p className="text-gray-400 text-xs mt-1">Klik tombol "+ Tambah Berita" untuk membuat artikel baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritaList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div>
                {/* Gambar dengan Overlay Tanggal */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/50 text-[11px] font-semibold text-amber-700 flex items-center gap-1.5 shadow-sm">
                    <Calendar size={12} /> {item.date}
                  </div>
                </div>

                {/* Konten Berita */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-amber-50 text-amber-700 hover:text-amber-800 border border-gray-200 hover:border-amber-200 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200 hover:border-rose-200 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleOpenAddModal}
        className="fixed bottom-8 right-8 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer z-40 flex items-center gap-2"
      >
        <Plus size={20} />
        <span>Tambah Berita</span>
      </button>

      {/* Modal / Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                {editingId ? <Pencil size={16} className="text-amber-500" /> : <Plus size={18} className="text-amber-500" />}
                {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Judul Berita
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Masukkan judul berita..."
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tanggal Publikasi
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  placeholder="Contoh: 10 SEP 2025"
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Isi / Deskripsi Berita
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  required
                  placeholder="Tuliskan konten berita secara rinci..."
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Gambar Berita
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-gray-200 rounded-xl"
                  />
                </div>

                {previewImage && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video max-h-40">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}