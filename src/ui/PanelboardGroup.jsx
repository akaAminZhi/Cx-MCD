import Panelboard from "./Panelboard";

function PanelboardGroup({ panelboards = [], devices = new Map() }) {
  function handleClick(item) {
    console.log("Clicked Panelboard:", item.id);
  }
  return panelboards.map((item,idx) => {
    const device = devices?.get(item.name);
    
    return (
      <Panelboard
        key={item.id}
        name={item.text}
        x1={item.rect_px[0]}
        y1={item.rect_px[1]}
        x2={item.rect_px[2]}
        y2={item.rect_px[3]}
        energized={device?.energized ?? false}
        onClick={() => handleClick(item)}
        tooltip={item.text}
      />
    );
  });
}

export default PanelboardGroup;
