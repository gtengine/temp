import mermaid from "mermaid";
import { useEffect } from "react";

export default function MermaidChart({ chart }: { chart: string }) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  return <div className="mermaid">{chart}</div>;
}
