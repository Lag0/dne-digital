export const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-wrap">
    <span className="text-[#5c5c5c] font-bold mr-1">{label}:</span>
    {/* text-gray-500 e font-normal deixam o texto da variável mais fino e cinza, conforme solicitado */}
    <span className="text-gray-500 font-normal tracking-tight">{value}</span>
  </div>
);
