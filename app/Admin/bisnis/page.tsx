'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  Save, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface BisnisData {
  id?: number;
  title: string;
  content: string;
  bgImage: string;
}

export default function AdminBisnisPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [currentBg, setCurrentBg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    axios
      .get<BisnisData>(`${API_URL}/api/bisnis`)
      .then((res) => {
        setTitle(res.data.title || '');
        setContent(res.data.content || '');
        if (res.data.bgImage) {
          const fullImg = res.data.bgImage.startsWith('http')
            ? res.data.bgImage
            : `${API_URL}${res.data.bgImage}`;
          setCurrentBg(fullImg);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil data:', err);
        setStatusMessage({ text: 'Gagal memuat data dari server.', isError: true });
      })
      .finally(() => {
        setLoadingFetch(false);
      });
  }, [API_URL]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBgImageFile(file);
      setCurrentBg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (bgImageFile) {
      formData.append('bgImage', bgImageFile);
    }

    try {
      await axios.put(`${API_URL}/api/bisnis`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatusMessage({ text: 'Perubahan berhasil disimpan!', isError: false });
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      setStatusMessage({ text: 'Gagal menyimpan perubahan ke server.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm font-sans">
        Memuat data bisnis...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 pb-24 font-sans space-y-6">
      {/* Header Halaman */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
          <Briefcase className="text-amber-500 stroke-[2.2]" /> Kelola Section Bisnis
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Atur informasi layanan dan unit bisnis utama yang ditampilkan pada portal.
        </p>
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

      {/* Form Utama Berdesain Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Input Judul */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            Judul Bisnis
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul bisnis..."
            required
            className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {/* Input Deskripsi */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            Isi / Deskripsi Bisnis
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Masukkan rincian deskripsi bisnis..."
            rows={5}
            required
            className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Input Gambar Bisnis */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-gray-700">
            Gambar Bisnis
          </label>
          
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-gray-200 rounded-xl"
            />
          </div>

          {/* Preview Gambar */}
          {currentBg && (
            <div className="mt-4 space-y-2">
              <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                <ImageIcon size={14} className="text-amber-500" /> Preview Gambar Saat Ini:
              </span>
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video max-h-72">
                <img
                  src={currentBg}
                  alt="Bisnis Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}