'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PhotoCardProps {
  src: string
  fallbackSrc: string
  alt: string
}

/**
 * Card da foto do estudante com fallback local → CDN.
 * CARD-03: tenta src local primeiro; onError troca para fallbackSrc se ausente.
 * Parent externo tem w-1/2 e o container pai tem h-[280px] — fill herda essas dimensoes.
 */
export const PhotoCard = ({ src, fallbackSrc, alt }: PhotoCardProps) => {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <div className="bg-white rounded-xl p-1.5 shadow-sm w-1/2 relative">
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="195px"
          className="object-cover"
          onError={() => {
            if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc)
          }}
        />
      </div>
    </div>
  )
}
