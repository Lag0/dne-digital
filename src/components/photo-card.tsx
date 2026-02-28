import Image from 'next/image';

interface PhotoCardProps {
  src: string;
  alt: string;
}

/**
 * Card da foto do estudante com proporcao correta via next/image fill mode.
 * Parent externo tem w-1/2 e o container pai tem h-[280px] — fill herda essas dimensoes.
 */
export const PhotoCard = ({ src, alt }: PhotoCardProps) => (
  <div className="bg-white rounded-xl p-1.5 shadow-sm w-1/2 relative">
    {/* Inner div precisa de position:relative e dimensoes para o fill funcionar */}
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="195px"
        className="object-cover"
      />
    </div>
  </div>
);
