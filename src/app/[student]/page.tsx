import { InfoRow } from "@/components/info-row";
import { DATABASE, STUDENT_IDS } from "@/constants";
import { notFound } from "next/navigation";
import { CardHeader } from "@/components/card-header";
import { CardFooter } from "@/components/card-footer";
import { PhotoCard } from "@/components/photo-card";
import { QrCard } from "@/components/qr-card";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ student: string }>;
}) {
  const { student } = await params;
  const data = DATABASE[student];

  if (!data) {
    notFound();
  }

  return (
    // Container Principal (Background escuro para desktop, simula o celular)
    <main className="min-h-screen bg-stone-900 flex items-center justify-center p-0 md:p-4 font-sans">
      {/* Dispositivo Mobile */}
      <div className="w-full max-w-[390px] bg-dne-mint h-[100dvh] md:h-[844px] md:rounded-[40px] overflow-hidden relative flex flex-col shadow-2xl border-0 md:border-8 border-stone-800">
        {/* --- STATUS BAR (Fake) --- */}
        {/* <div className="px-6 pt-3 pb-2 flex justify-between items-center text-black font-semibold text-sm z-20">
          <span>14:30</span>
          <div className="flex gap-1.5 items-center">
            <div className="h-3 w-3 bg-black rounded-full opacity-20"></div>
            <div className="h-3 w-3 bg-black rounded-full opacity-20"></div>
            <div className="bg-black/20 rounded px-1 text-[10px]">5G</div>
            <div className="w-6 h-3 border border-black/40 rounded-[3px] relative">
              <div className="h-full bg-black w-[70%]"></div>
            </div>
          </div>
        </div> */}

        {/* --- NOTCH (Apenas visual para desktop) --- */}
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-10 hidden md:block pointer-events-none"></div> */}

        {/* --- HEADER --- */}
        <CardHeader />

        {/* --- ÁREA DAS CARTAS (FOTO E QR) --- */}
        <div className="px-3 py-2 flex gap-3 h-[280px]">
          <PhotoCard src={data.foto} alt="Foto do estudante" />
          <QrCard codigoCie={data.codigoCie} />
        </div>

        {/* --- CARD DE INFORMAÇÕES --- */}
        <div className="mx-3 mt-3 bg-white rounded-2xl p-5 shadow-sm relative">
          {/* Nome Principal */}
          <h2 className="text-[#555555] font-bold text-lg mb-3 leading-tight">
            {data.nome}
          </h2>

          {/* Lista de Dados - Usando grid para alinhamento perfeito */}
          <div className="space-y-[5px] text-[13px] leading-snug">
            <InfoRow label="Ins. Ensino" value={data.instituicao} />
            <InfoRow label="Curso" value={data.curso} />
            <InfoRow label="CPF" value={data.cpf} />
            <InfoRow label="Data de Nasc" value={data.nascimento} />
            <InfoRow label="Validade" value={data.validade} />
          </div>
        </div>

        {/* --- FOOTER --- */}
        <CardFooter />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return STUDENT_IDS.map((student) => ({ student }));
}
