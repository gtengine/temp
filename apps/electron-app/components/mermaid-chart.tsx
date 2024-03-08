import mermaid from "mermaid";
import { useEffect } from "react";

export default function MermaidChart({
  chart,
  language,
}: {
  chart: string;
  language: string;
}) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      fontSize: 20,
    });
    mermaid.contentLoaded();
  }, []);

  return (
    <div className={language === "C" ? "w-85% h-85%" : "w-80% h-80%"}>
      <div className="mermaid">{chart}</div>
    </div>
  );
}
