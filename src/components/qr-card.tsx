import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCardProps {
  codigoCie: string;
}

/**
 * Card do QR code com label e codigo CIE abaixo.
 * QR gerado localmente via qrcode.react — sem dependencia de CDN externo.
 * Botao Copy e placeholder visual (funcionalidade de clipboard em Phase 3 — CARD-06).
 */
export const QrCard = ({ codigoCie }: QrCardProps) => (
  <div className="bg-white rounded-xl py-1 shadow-sm w-1/2 flex flex-col items-center justify-center text-center relative">
    <QRCodeSVG
      value={codigoCie}
      size={160}
      bgColor="#FFFFFF"
      fgColor="#000000"
      level="M"
      marginSize={1}
      className="w-[95%] mix-blend-multiply"
    />
    <div className="mt-2 flex flex-col items-center">
      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
        Nº da CIE
      </span>
      <div className="flex items-center gap-1 text-stone-800 font-bold text-sm">
        {codigoCie}
        <Copy size={12} className="text-gray-400 ml-1" />
      </div>
    </div>
  </div>
);
