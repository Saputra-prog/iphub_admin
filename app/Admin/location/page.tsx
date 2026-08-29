"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Trash2, 
  UploadCloud, 
  MapPin, 
  Save, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  FileText
} from "lucide-react";

export default function LocationAdmin() {
  const [address, setAddress] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  // Helper untuk memastikan data yang disimpan di state selalu berbentuk Array
  const parseImagesArray = (rawImages: any): string[] => {
    if (Array.isArray(rawImages)) {
      return rawImages;
    }
    if (typeof rawImages === "string") {
      try {
        const parsed = JSON.parse(rawImages);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // Fetch Data Lokasi
  const fetchLocationData = async () => {
    try {
      setLoadingFetch(true);
      const res = await axios.get(`${API_URL}/api/location`);
      if (res.data?.success && res.data?.data) {
        setAddress(res.data.data.address || "");
        
        // Pengecekan ekstra untuk memastikan selalu bertipe Array
        const safeImages = parseImagesArray(res.data.data.images);
        setImages(safeImages);
      }
    } catch (err: any) {
      console.error("Gagal memuat lokasi:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal memuat data lokasi dari server.",
      });
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  // Simpan Alamat
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAddress(true);
    setMessage(null);

    try {
      const res = await axios.put(`${API_URL}/api/location/address`, { address });
      if (res.data?.success) {
        setMessage({ type: "success", text: "Alamat berhasil disimpan!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal memperbarui alamat.",
      });
    } finally {
      setLoadingAddress(false);
    }
  };

  // Upload Foto
  const handleUploadPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage({ type: "error", text: "Pilih minimal satu foto untuk diunggah." });
      return;
    }

    setLoadingUpload(true);
    setMessage(null);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }

    try {
      const res = await axios.post(`${API_URL}/api/location/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        const safeImages = parseImagesArray(res.data.data.images);
        setImages(safeImages);
        setSelectedFiles(null);
        setMessage({ type: "success", text: "Foto berhasil diunggah!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal mengunggah foto.",
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  // Hapus Foto
  const handleDeletePhoto = async (imageUrl: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;

    try {
      const res = await axios.delete(`${API_URL}/api/location/photos`, {
        data: { imageUrl },
      });
      if (res.data?.success) {
        const safeImages = parseImagesArray(res.data.data.images);
        setImages(safeImages);
        setMessage({ type: "success", text: "Foto berhasil dihapus!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal menghapus foto.",
      });
    }
  };

  if (loadingFetch) {
    return (
      <div className="min-h-100 flex items-center justify-center text-gray-500 font-sans text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Memuat data lokasi...</span>
        </div>
      </div>
    );
  }

  // Pengamanan langsung saat render
  const safeImagesList = parseImagesArray(images);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 pb-24 font-sans space-y-6">
      
      {/* Header Halaman */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
          <MapPin className="text-amber-500 stroke-[2.2]" /> Pengelolaan Lokasi
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola teks alamat utama dan galeri foto lokasi kantor/operasional.
        </p>
      </div>

      {/* Alert Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
            message.type === "success"
              ? "bg-amber-50 border border-amber-200 text-amber-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form Edit Alamat */}
      <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Building2 size={18} className="text-amber-500" />
          <h2 className="font-bold text-sm text-gray-800">Alamat Kantor / Lokasi</h2>
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Alamat Lengkap <span className="text-amber-500">*</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400 resize-none"
            placeholder="Masukkan alamat lengkap kantor..."
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loadingAddress}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} /> <span>{loadingAddress ? "Menyimpan..." : "Simpan Alamat"}</span>
          </button>
        </div>
      </form>

      {/* Form Upload Foto */}
      <form onSubmit={handleUploadPhotos} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <UploadCloud size={18} className="text-amber-500" />
          <h2 className="font-bold text-sm text-gray-800">Tambah Foto Lokasi Baru</h2>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Unggah File Foto <span className="text-amber-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-gray-200 rounded-xl"
            />
            <button
              type="submit"
              disabled={loadingUpload}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              <UploadCloud size={16} /> <span>{loadingUpload ? "Mengunggah..." : "Upload Foto"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Daftar Galeri Foto */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon size={18} className="text-amber-500" /> Galeri Foto Lokasi Saat Ini
          </h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
            {safeImagesList.length} Foto
          </span>
        </div>

        <div className="p-6">
          {safeImagesList.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
              <FileText size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400 font-medium">Belum ada foto lokasi yang diunggah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {safeImagesList.map((img: string, index: number) => {
                const fullImgUrl = img.startsWith("http") ? img : `${API_URL}${img}`;
                return (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video shadow-xs transition-all hover:border-amber-300"
                  >
                    <img src={fullImgUrl} alt={`Foto Lokasi ${index + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2.5">
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(img)}
                        className="bg-white/90 hover:bg-rose-600 text-gray-700 hover:text-white p-2 rounded-lg transition-all shadow-sm cursor-pointer"
                        title="Hapus foto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}