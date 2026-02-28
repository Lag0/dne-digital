import { Check } from 'lucide-react';
import Image from 'next/image';
import AppleWalletImage from '@/assets/apple-wallet.png';

/**
 * Footer da carteirinha com botao Certificado (pill azul solido) e badge Apple Wallet.
 * FOOT-01: bg-dne-navy substituindo o transparente com borda do original.
 * FOOT-02: Badge Apple Wallet com dimensoes corretas.
 */
export const CardFooter = () => (
  <div className="mt-auto px-3 pb-8 w-full flex flex-col gap-4 items-center">
    {/* FOOT-01: Botao Certificado — pill azul solido */}
    <button className="w-[280px] py-3 rounded-full bg-dne-navy text-white flex items-center justify-center gap-2 text-sm font-medium">
      <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
        <Check size={10} strokeWidth={4} />
      </div>
      Certificado
    </button>

    {/* FOOT-02: Badge Apple Wallet */}
    <div
      className="h-[46px] rounded-lg transition-colors hover:bg-stone-900 shadow-lg relative overflow-hidden p-0"
      aria-label="Adicionar à Carteira da Apple"
    >
      <Image
        src={AppleWalletImage}
        alt="Apple Wallet"
        width={160}
        height={46}
        className="w-[160px] h-[46px]"
      />
    </div>
  </div>
);
