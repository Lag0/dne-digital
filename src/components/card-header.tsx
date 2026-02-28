import Image from "next/image";
import { Menu } from "lucide-react";

/**
 * Header da carteirinha DNE com logo, subtitulo, icone UNE e hamburger.
 * RSC — sem interatividade.
 */
export const CardHeader = () => (
  <header className="px-3 pt-2 pb-4 flex justify-between items-center">
    {/* HEAD-01 + HEAD-02: Logo DNE + subtitulo */}
    <div className="flex flex-row items-center">
      <Image
        src="/dne-logo.png"
        alt="DNE - Documento Nacional do Estudante"
        width={72}
        height={40}
        className="object-contain"
      />
      <span className="ml-2 text-dne-navy text-[10px] font-medium leading-tight">
        Documento<br /> Nacional<br /> do Estudante
      </span>
    </div>

    <div className="flex items-center gap-4">
      {/* HEAD-03: Icone UNE */}
      <Image
        src="/une-logo.png"
        alt="UNE - Uniao Nacional dos Estudantes"
        width={36}
        height={36}
        className="object-contain"
      />

      {/* HEAD-04: Icone hamburger — Menu do Lucide com cor e tamanho corretos */}
      <Menu className="text-dne-navy" size={28} strokeWidth={3} />
    </div>
  </header>
);
