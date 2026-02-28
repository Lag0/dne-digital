'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface QrCardProps {
  codigoCie: string
}

/**
 * Card do QR code com clipboard interativo.
 * CARD-06: copia codigoCie para clipboard e exibe feedback Check verde por 2s.
 * QR gerado localmente via qrcode.react — sem dependencia de CDN externo.
 */
export const QrCard = ({ codigoCie }: QrCardProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codigoCie)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // clipboard API indisponivel
    }
  }

  return (
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
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-stone-800 font-bold text-sm"
          aria-label="Copiar código CIE"
        >
          {codigoCie}
          {isCopied
            ? <Check size={12} className="text-green-500 ml-1" />
            : <Copy size={12} className="text-gray-400 ml-1" />
          }
        </button>
      </div>
    </div>
  )
}
