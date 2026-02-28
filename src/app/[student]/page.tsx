import { Copy } from "lucide-react";
import { InfoRow } from "@/components/info-row";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { DATABASE, STUDENT_IDS } from "@/constants";
import { notFound } from "next/navigation";
import { CardHeader } from "@/components/card-header";
import { CardFooter } from "@/components/card-footer";

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
          {/* Foto do Aluno */}
          <div className="bg-white rounded-xl p-1.5 shadow-sm w-1/2 relative">
            <Image
              src={data.foto}
              alt="Foto do estudante"
              width={440}
              height={550}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* Marca d'água sutil ou brilho se necessário */}
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl py-1 shadow-sm w-1/2 flex flex-col items-center justify-center text-center relative">
            <QRCodeSVG
              value={data.codigoCie}
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
                {data.codigoCie}
                <Copy size={12} className="text-gray-400 ml-1" />
              </div>
            </div>
          </div>
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
        <div className="mt-auto px-3 pb-8 w-full flex flex-col gap-4 items-center">
          {/* Botão Certificado */}
          <button className="w-[280px] py-3 rounded-full border border-white/40 text-white flex items-center justify-center gap-2 text-sm font-medium backdrop-blur-sm">
            <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
              <Check size={10} strokeWidth={4} />
            </div>
            Certificado
          </button>

          {/* Botão Apple Wallet */}
          <div
            className="h-[46px] rounded-lg transition-colors hover:bg-stone-900 shadow-lg relative overflow-hidden p-0"
            aria-label="Adicionar à Carteira da Apple"
          >
            <Image
              src={AppleWalletImage}
              alt="Apple Wallet"
              width={220}
              height={35}
              className="w-[160px] h-[46px]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

const AppleWalletBadge = () => (
  <AppleWallet
    className="absolute inset-0 w-full h-full block"
    role="img"
    aria-label="Adicionar à Carteira da Apple"
  />
);

export function generateStaticParams() {
  return STUDENT_IDS.map((student) => ({ student }));
}
