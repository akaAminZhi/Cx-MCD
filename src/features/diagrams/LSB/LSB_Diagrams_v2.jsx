import { useRef, useState } from "react";
import Button from "../../../ui/Button";
import PanZoomSVG from "../../../ui/PanZoomSVG";
import LSB_Emergency_Raiser from "./LSB_Emergency_Raiser";
import LSB_Normal_Raiser from "./LSB_Normal_Raiser";

function LSB_Diagrams() {
  const [showDiagram, setShowDiagram] = useState("Normal");
  const normalRef = useRef(null);
  const emergencyRef = useRef(null);
  function handleClick(e) {
    // console.log(e.currentTarget.textContent.trim());
    setShowDiagram(e.currentTarget.textContent.trim());
  }

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
  return (
    <>
      <div className="flex gap-x-1">
        <Button onClick={handleClick} disabled={showDiagram === "Normal"}>
          Normal
        </Button>
        <Button onClick={handleClick} disabled={showDiagram === "Emergency"}>
          Emergency
        </Button>
        <Button onClick={handlePrint}>打印当前图纸</Button>
      </div>

      <div
        ref={emergencyRef}
        className={`m-2 ${showDiagram === "Normal" ? "hidden" : ""}`}
      >
        <PanZoomSVG height="800px">
          <LSB_Emergency_Raiser />
        </PanZoomSVG>
      </div>
      <div
        ref={normalRef}
        className={`m-2 ${showDiagram === "Emergency" ? "hidden" : ""}`}
      >
        <PanZoomSVG height="800px">
          <LSB_Normal_Raiser />
        </PanZoomSVG>
      </div>
    </>
  );
}

export default LSB_Diagrams;
