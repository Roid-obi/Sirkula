import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      q: 'Material apa saja yang diterima oleh mesin RVM Sirkula?',
      a: 'Saat ini Smart RVM Sirkula menerima botol plastik minuman PET (bening maupun berwarna) dan kaleng minuman aluminium dalam kondisi kosong.'
    },
    {
      q: 'Mengapa botol saya ditolak (reject)?',
      a: 'Kemasan akan ditolak jika masih berisi sisa cairan berlebih (terdeteksi berat di luar batas kosong), bentuk terlalu hancur sehingga AI tidak mengenali fitur botol, atau berupa benda asing seperti kaca/kresek.'
    },
    {
      q: 'Kapan poin reward masuk ke akun saya?',
      a: 'Poin diterbitkan secara instan dan atomik setelah sensor dan aktuator mesin mengonfirmasi bahwa kemasan telah aman tersortir ke dalam kompartemen.'
    },
    {
      q: 'Bagaimana cara menukarkan poin reward?',
      a: 'Buka menu Reward di navigasi bawah, pilih hadiah/voucher yang diinginkan, lalu klik Tukarkan untuk mendapatkan kode voucher digital unik.'
    }
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Native App Bar */}
      <div className="flex items-center gap-3 pt-2 pb-1">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">Bantuan &amp; FAQ</h1>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, i) => (
          <div key={i} className="mobile-card p-4 space-y-1.5 text-xs">
            <h3 className="font-bold text-foreground flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed pl-6 text-[11px]">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
