'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ChangeCredentialsPage() {
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      
      const response = await axios.put(
        `${apiUrl}/api/auth/change-credentials`,
        { currentUsername, newUsername, oldPassword, newPassword },
        { withCredentials: true }
      );

      setMessage(response.data.message || 'Data akun berhasil diperbarui. Mengalihkan ke login...');
      
      // Tunggu sebentar lalu arahkan kembali ke halaman login
      setTimeout(() => {
        router.push('/Admin/login');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui data akun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
      <h1 className="text-2xl font-bold text-white mb-6">Ubah Username & Password</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 text-sm rounded-lg text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Username Saat Ini</label>
          <input
            type="text"
            value={currentUsername}
            onChange={(e) => setCurrentUsername(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Masukkan username aktif"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Username Baru (Opsional)</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Kosongkan jika tidak ingin mengubah username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password Lama</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Wajib diisi untuk verifikasi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password Baru (Opsional)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Kosongkan jika tidak ingin mengubah password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}