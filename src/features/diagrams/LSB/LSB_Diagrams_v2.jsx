import { useRef, useState } from "react";
import Button from "../../../ui/Button";
import PanZoomSVG from "../../../ui/PanZoomSVG";
import LSB_Emergency_Raiser from "./LSB_Emergency_Raiser";
import LSB_Normal_Raiser from "./LSB_Normal_Raiser";

function LSB_Diagrams() {
  const [showDiagram, setShowDiagram] = useState("Normal");
  const normalRef = useRef(null);
  const emergencyRef = useRef(null);

  const handlePrint = () => {
    const svgContainer =
      showDiagram === "Normal" ? normalRef.current : emergencyRef.current;
    if (!svgContainer) return;

    const svgElement = svgContainer.querySelector("svg");
    if (!svgElement) {
      alert("未找到 SVG 元素");
      return;
    }

    
  };
  const tabs = ["Normal", "Emergency"];

  return (
    <section className="m-2 rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-stone-700">
            LSB Diagram Viewer
          </h2>
          <div className="inline-flex rounded-xl border border-stone-200 bg-stone-50 p-1">
            {tabs.map((tab) => (
              <Button
                key={tab}
                size="small"
                variation={showDiagram === tab ? "primary" : "secondary"}
                className="rounded-lg px-4 py-2 text-base normal-case shadow-none"
                onClick={() => setShowDiagram(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
        <Button size="small" className="text-base" onClick={handlePrint}>
          打印当前图纸
        </Button>
      </div>

      <div
        ref={emergencyRef}
        className={`p-4 ${showDiagram === "Normal" ? "hidden" : ""}`}
      >
        <PanZoomSVG height="76vh">
          <LSB_Emergency_Raiser />
        </PanZoomSVG>
      </div>
      <div
        ref={normalRef}
        className={`p-4 ${showDiagram === "Emergency" ? "hidden" : ""}`}
      >
        <PanZoomSVG height="76vh">
          <LSB_Normal_Raiser />
        </PanZoomSVG>
      </div>
    </section>
  );
}

export default LSB_Diagrams;
