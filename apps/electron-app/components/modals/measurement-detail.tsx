import {
  sequenceDiagramC,
  sequenceDiagramJS,
} from "@/constants/detail-sequence-data";
import MermaidChart from "../mermaid-chart";

export default function MeasurementSectionDetail({
  onClose,
  language,
}: {
  onClose: () => void;
  language: string;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center select-none z-20">
      <div className="bg-white min-w-[918px] min-h-[641px] w-95% h-95% p-4 rounded-lg flex flex-col justify-between">
        <h2 className="font-bold text-center">{`${language} API 성능 측정 구간 상세`}</h2>
        {/* 모달 내용 */}
        <div className="flex justify-center w-full pt-4">
          <MermaidChart
            chart={language === "C" ? sequenceDiagramC : sequenceDiagramJS}
            language={language}
          />
        </div>
        <button onClick={onClose} className="btn--theme py-1 mt-4">
          닫기
        </button>
      </div>
    </div>
  );
}
