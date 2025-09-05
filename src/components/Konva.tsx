// import React, { useEffect, useState } from "react";
// import { Stage, Layer, Line, Text } from "react-konva";
// import { useClient } from "../utils/UseClient";

const App = () => {
  //   const [tool, setTool] = React.useState("pen");
  //   type LineType = {
  //     points: number[];
  //     tool: string;
  //   };
  //   const isDrawing = React.useRef(false);
  //   useEffect(()=>{
  //   },[])
  //   const handleMouseDown = (e: any) => {
  //     if (!isDrawer) return;
  //     isDrawing.current = true;
  //     const pos = e.target.getStage().getPointerPosition();
  //     const newLine = { tool, points: [pos.x, pos.y] };
  //     setLines([...lines, newLine]);
  //   };
  //   const handleMouseMove = (e: any) => {
  //     if (!isDrawer || !isDrawing.current) return;
  //     const stage = e.target.getStage();
  //     const point = stage.getPointerPosition();
  //     let lastLine = lines[lines.length - 1];
  //     lastLine = {
  //       ...lastLine,
  //       points: lastLine.points.concat([point.x, point.y]),
  //     };
  //     const updatedLines = lines.slice(0, lines.length - 1).concat(lastLine);
  //     setLines(updatedLines);
  //   };
  //   const handleMouseUp = () => {
  //     if (!isDrawer) return;
  //     isDrawing.current = false;
  //   };
  //   const handleBecomeDrawer = () => {
  //     setIsDrawer(true);
  //     setLines([]);
  //   };
  //   const handleBecomeViewer = () => {
  //     setIsDrawer(false);
  //     setLines([]);
  //   };
  //   return (
  //     <div>
  //       <div style={{ marginBottom: 10 }}>
  //         <button
  //           onClick={handleBecomeDrawer}
  //           disabled={isDrawer}
  //           style={{ marginRight: 5 }}
  //         >
  //           Ritare
  //         </button>
  //         <button onClick={handleBecomeViewer} disabled={!isDrawer}>
  //           Gissare
  //         </button>
  //       </div>
  //       {isDrawer && (
  //         <select value={tool} onChange={(e) => setTool(e.target.value)}>
  //           <option value="pen">Pen</option>
  //           <option value="eraser">Eraser</option>
  //         </select>
  //       )}
  //       <Stage
  //         width={window.innerWidth}
  //         height={window.innerHeight}
  //         onMouseDown={handleMouseDown}
  //         onMousemove={handleMouseMove}
  //         onMouseup={handleMouseUp}
  //         onTouchStart={handleMouseDown}
  //         onTouchMove={handleMouseMove}
  //         onTouchEnd={handleMouseUp}
  //         style={{ border: "1px solid #ccc", marginTop: 10 }}
  //       >
  //         <Layer>
  //           <Text
  //             text={isDrawer ? "Draw something!" : "Live view"}
  //             x={5}
  //             y={30}
  //           />
  //           {lines.map((line, i) => (
  //             <Line
  //               key={i}
  //               points={line.points}
  //               stroke="#df4b26"
  //               strokeWidth={5}
  //               tension={0.5}
  //               lineCap="round"
  //               lineJoin="round"
  //               globalCompositeOperation={
  //                 line.tool === "eraser" ? "destination-out" : "source-over"
  //               }
  //             />
  //           ))}
  //         </Layer>
  //       </Stage>
  //       {!connected && (
  //         <div style={{ color: "red" }}>Connecting to server...</div>
  //       )}
  //     </div>
  //   );
};

export default App;
