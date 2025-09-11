import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { ColoprPicker } from "./ColorPicker";
import { useGameClient } from "../utils/UseLineClient";

interface KonvaProps {
  isDrawer: boolean;
}

export function KonvaDrawing({ isDrawer }: KonvaProps) {
  const [tool, setTool] = React.useState("pen");
  const { connected, lines, sendLine, setLines } = useGameClient();
  const [selectedColor, setSelectedColor] = useState<string>("#563d7c");

  const isDrawing = React.useRef(false);
  const currentLine = useRef<{
    tool: string;
    points: number[];
    color: string;
    newLine: boolean;
  } | null>(null);

  // rensar konvabrädet här istället för i uselineclient
  useEffect(() => {
    setLines([]);
  }, [isDrawer]);

  // denna hanterar när vi trycker ner musknappen
  const handleMouseDown = (e: any) => {
    if (!isDrawer) return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    console.log("Pointer position:", pos);
    const newLine = {
      tool,
      points: [pos.x, pos.y],
      color: selectedColor,
      newLine: true,
    };
    currentLine.current = newLine;
    console.log("Sending line:", newLine);
    sendLine(newLine);
  };

  // handerar musrörelsen
  const handleMouseMove = (e: any) => {
    if (!isDrawer || !isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (currentLine.current && currentLine.current.points) {
      currentLine.current.points = currentLine.current.points.concat([
        point.x,
        point.y,
      ]);
      sendLine({
        tool: currentLine.current.tool,
        points: currentLine.current.points,
        color: currentLine.current.color,
        newLine: false,
      });
    }
  };

  // hanterar när vi släpper musknappen
  const handleMouseUp = () => {
    if (!isDrawer) return;
    isDrawing.current = false;
    currentLine.current = null;
  };

  return (
    <div className="flex flex-row justify-end min-h-screen">
      <div className="flex flex-col items-end gap-4 p-4">
        <div className="flex flex-row gap-2 w-full max-w-xl items-center">
          <ColoprPicker onColorChange={setSelectedColor} />
          {isDrawer && (
            <div className="flex gap-2">
              <select value={tool} onChange={(e) => setTool(e.target.value)}>
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
              </select>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
            </div>
          )}
        </div>
        <Stage
          width={800}
          height={500}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-400 mt-4"
        >
          <Layer>
            <Text
              text={isDrawer ? "Draw something!" : "Live view"}
              x={5}
              y={30}
            />
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
        {!connected && (
          <div style={{ color: selectedColor }}>Connecting to server...</div>
        )}
      </div>
    </div>
  );
}
