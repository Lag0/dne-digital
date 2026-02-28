import Image from "next/image";
import { Menu } from "lucide-react";

/**
 * Header da carteirinha DNE com logo, subtitulo, icone UNE e hamburger.
 * RSC — sem interatividade.
 */
export const CardHeader = () => (
  <header className="px-3 pt-2 pb-4 flex justify-between items-center">
    {/* HEAD-01 + HEAD-02: Logo com fonte Nunito e subtitulo */}
    <div className="flex flex-row items-center">
      <h1
        className="text-dne-navy text-5xl font-extrabold tracking-tighter select-none leading-none"
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        dne
      </h1>
      <span className="ml-2 text-dne-navy text-[10px] font-medium leading-tight">
        Documento<br/> Nacional <br/> do Estudante
      </span>
    </div>

    <div className="flex items-center gap-4">
      {/* HEAD-03: Icone UNE via next/image (une-logo.webp) — substituindo Globe do Lucide */}
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
        <Image
          src="/une-logo.webp"
          alt="UNE - Uniao Nacional dos Estudantes"
          width={28}
          height={28}
          className="w-7 h-7 object-contain"
        />
      </div>

      {/* HEAD-04: Icone hamburger — Menu do Lucide com cor e tamanho corretos */}
      <Menu className="text-dne-navy" size={28} strokeWidth={3} />
    </div>
  </header>
);
