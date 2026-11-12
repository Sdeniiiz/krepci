import React from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

export default function PosterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-5xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-700 max-h-[90vh] flex flex-col">
        {/* Üst Bar */}
        <div className="p-4 bg-stone-800 flex items-center justify-between text-white border-b border-stone-700">
          <div>
            <h3 className="font-serif font-bold text-base text-amber-400">
              KREPCİ Ev Yemekleri - Orijinal Haftalık Menü Posteri
            </h3>
            <p className="text-xs text-stone-400">09 - 14 Kasım 2026 Menüsü & Fiyat Tarifesi</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/krepci-menu-poster.png"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              title="Yeni Sekmede Aç"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Tam Boyut</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Poster Görseli */}
        <div className="p-4 overflow-auto flex items-center justify-center bg-stone-950">
          <img
            src="/krepci-menu-poster.png"
            alt="Krepçi Ev Yemekleri Haftalık Menü Posteri"
            className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
