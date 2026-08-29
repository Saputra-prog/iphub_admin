"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { 
  Image as ImageIcon, 
  Megaphone, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  UploadCloud 
} from "lucide-react";

interface BannerItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function AdminPromoBanner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/promo-banners`);
      if (res.data?.success) {
        setBanners(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data banner:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [API_URL]);

  // Handle File Input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  // Reset Form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setPreviewImage("");
    setEditingId(null);
  };

  // Populate Form for Edit
  const handleEdit = (banner: BannerItem) => {
    setEditingId(banner.id);
    setTitle(banner.title);
    setDescription(banner.description || "");
    setPreviewImage(`${API_URL}${banner.image}`);
    setFile(null);
  };

  // Handle Submit (Create / Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Judul banner wajib diisi!");
      return;
    }
    if (!editingId && !file) {
      alert("Gambar banner wajib diunggah untuk banner baru!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) {
      formData.append("image", file);
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/promo-banners/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Banner berhasil diperbarui!");
      } else {
        await axios.post(`${API_URL}/api/promo-banners`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Banner berhasil ditambahkan!");
      }
      resetForm();
      fetchBanners();
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;

    try {
      await axios.delete(`${API_URL}/api/promo-banners/${id}`);
      alert("Banner berhasil dihapus!");
      fetchBanners();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus banner!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 pb-24 font-sans space-y-6">
      
      {/* Header Halaman */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
          <Megaphone className="text-amber-500 stroke-[2.2]" /> Kelola Banner Promo
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Unggah dan perbarui banner promosi yang akan ditayangkan di portal.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            {editingId ? (
              <>
                <Pencil size={16} className="text-amber-500" /> Edit Banner Promo
              </>
            ) : (
              <>
                <Plus size={18} className="text-amber-500" /> Tambah Banner Promo Baru
              </>
            )}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X size={14} /> Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Judul Banner <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul promosi..."
              className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Deskripsi Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Deskripsi Banner <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan deskripsi ringkas promosi..."
              rows={3}
              className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Upload Gambar Input */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-gray-700">
              Gambar Banner <span className="text-amber-500">*</span>
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
            {previewImage && (
              <div className="mt-3 space-y-1.5">
                <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                  <ImageIcon size={14} className="text-amber-500" /> Preview Gambar:
                </span>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-w-sm aspect-video">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tombol Simpan */}
          <div className="flex gap-2 pt-4 border-t border-gray-100 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              <span>{loading ? "Menyimpan..." : editingId ? "Update Banner" : "Simpan Banner"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800">Daftar Banner Promo</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-[11px] uppercase tracking-wider font-semibold border-b border-gray-100">
                <th className="py-3.5 px-5 w-12 text-center">No</th>
                <th className="py-3.5 px-5 w-36">Gambar</th>
                <th className="py-3.5 px-5">Judul</th>
                <th className="py-3.5 px-5">Deskripsi</th>
                <th className="py-3.5 px-5 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    Belum ada banner promo yang ditambahkan.
                  </td>
                </tr>
              ) : (
                banners.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-4 px-5 font-semibold text-gray-500 text-center">{idx + 1}</td>
                    <td className="py-4 px-5">
                      <div className="h-14 w-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                          src={`${API_URL}${item.image}`}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-5 font-bold text-gray-800">{item.title}</td>
                    <td className="py-4 px-5 text-gray-600 max-w-xs truncate">
                      {item.description || "-"}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1 py-1.5 px-3 bg-white hover:bg-amber-50 text-amber-700 border border-gray-200 hover:border-amber-200 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 py-1.5 px-3 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}