import { InfoRow } from "@/components/info-row";
import type { Student } from "@/constants";

interface InfoCardProps {
  student: Student;
}

/**
 * Card de informacoes do estudante com nome e 5 campos do app DNE original.
 * Campos exibidos: Ins. Ensino, Curso, CPF, Data de Nasc, Validade.
 * Campos excluidos: Nivel de Ensino e RG (nao aparecem no app original — INFO-04).
 */
export const InfoCard = ({ student }: InfoCardProps) => (
  <div className="mx-3 mt-3 bg-white rounded-2xl p-5 shadow-sm relative">
    {/* INFO-02: Nome do estudante em bold com tamanho e cor corretos */}
    <h2 className="text-[#555555] font-bold text-lg mb-3 leading-tight">
      {student.nome}
    </h2>

    {/* INFO-03 + INFO-05: 5 campos com pattern label bold + valor cinza */}
    <div className="space-y-[5px] text-[13px] leading-snug">
      <InfoRow label="Ins. Ensino" value={student.instituicao} />
      <InfoRow label="Curso" value={student.curso} />
      <InfoRow label="CPF" value={student.cpf} />
      <InfoRow label="Data de Nasc" value={student.nascimento} />
      <InfoRow label="Validade" value={student.validade} />
    </div>
  </div>
);
