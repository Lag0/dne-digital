import { DATABASE, STUDENT_IDS } from "@/constants";
import { notFound } from "next/navigation";
import { CardHeader } from "@/components/card-header";
import { CardFooter } from "@/components/card-footer";
import { PhotoCard } from "@/components/photo-card";
import { QrCard } from "@/components/qr-card";
import { InfoCard } from "@/components/info-card";

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
    <>
      {/* Dispositivo Mobile */}
      <div className="font-sans w-full bg-dne-mint h-[100dvh] overflow-hidden relative flex flex-col shadow-2xl border-0">
        <CardHeader />
        <div className="px-3 py-2 flex gap-3 h-[280px]">
          <PhotoCard
            src={`/photos/${student}.jpeg`}
            fallbackSrc={data.foto}
            alt="Foto do estudante"
          />
          <QrCard codigoCie={data.codigoCie} />
        </div>
        <InfoCard student={data} />
        <CardFooter />
      </div>
    </>
  );
}

export function generateStaticParams() {
  return STUDENT_IDS.map((student) => ({ student }));
}
