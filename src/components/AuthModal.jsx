import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      fullName: formData.name || 'Misafir Abone',
      phone: formData.phone,
      email: formData.email
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0e3d29] text-[#e2991e] flex items-center justify-center mx-auto mb-3 font-serif font-black text-xl shadow-md">
            K
          </div>
          <h3 className="font-serif text-2xl font-black text-[#0e3d29]">
            {isRegister ? 'Krepçi Abonelik Kaydı' : 'Abonelik Girişi'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isRegister 
              ? 'Yemek programınızı kaydetmek ve yönetmek için hesabınızı oluşturun.' 
              : 'Aktif aboneliğinizi ve haftalık yemek takviminizi görüntüleyin.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Adınız Soyadınız *</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#0e3d29] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Telefon Numaranız *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="tel"
                required
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#0e3d29] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">E-Posta Adresiniz</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#0e3d29] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Şifreniz *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#0e3d29] focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0e3d29] hover:bg-[#185a3e] text-white font-extrabold text-sm shadow-md transition-colors mt-2"
          >
            {isRegister ? 'Hesap Oluştur & Devam Et' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-stone-600">
          {isRegister ? 'Zaten hesabınız var mı? ' : 'Henüz hesabınız yok mu? '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-[#0e3d29] hover:underline"
          >
            {isRegister ? 'Giriş Yap' : 'Hemen Kayıt Ol'}
          </button>
        </div>
      </div>
    </div>
  );
}
