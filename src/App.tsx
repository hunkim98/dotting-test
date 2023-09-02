import { useEffect, useRef, useState } from "react";
import {
  CanvasHoverPixelChangeHandler,
  Dotting,
  DottingRef,
  PixelModifyItem,
  useBrush,
  useData,
  useDotting,
  useGrids,
  useHandlers,
} from "dotting";

function App() {
  const ref = useRef<DottingRef>(null);
  const { colorPixels } = useDotting(ref);
  const { indices, dimensions } = useGrids(ref);
  const {
    addHoverPixelChangeListener,
    removeHoverPixelChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
  } = useHandlers(ref);
  const [hoveredPixel, setHoveredPixel] = useState<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  useEffect(() => {
    const hoverPixelChangeListener: CanvasHoverPixelChangeHandler = (pixel) => {
      const { indices } = pixel;
      if (indices) {
        setHoveredPixel(indices);
      } else {
        setHoveredPixel(null);
      }
    };
    addHoverPixelChangeListener(hoverPixelChangeListener);
    return () => {
      removeHoverPixelChangeListener(hoverPixelChangeListener);
    };
  }, [addHoverPixelChangeListener, removeHoverPixelChangeListener]);

  useEffect(() => {
    const onCanvasClickListener = () => {
      // TASK: Make a firework effect when the user clicks on the canvas.
      // HINT1: You can use the `colorPixels` function to change the color of a pixel.
      // HINT2: You must know the boundaries of the current pixel canvas to take into considuration of the extent of the firework effect.
      // HINT3: You can use the indices and dimensions variables to get the boundaries of the current pixel canvas.
      // Check out the documentation for more information:
      // URL1: https://hunkim98.github.io/dotting/?path=/story/hooks-usedotting--page
      // URL2: https://hunkim98.github.io/dotting/?path=/story/hooks-usegrids--page
      // Do not modify any parts other than the below.
      // Modifiy ⬇️
      if (hoveredPixel) {
        const pixelsToColor: Array<PixelModifyItem> = [];
        console.log(
          `You clicked on rowIndex: ${hoveredPixel.rowIndex}, columnIndex: ${hoveredPixel.columnIndex}`
        );
        let leftTopPixelIndex = {
          rowIndex: hoveredPixel.rowIndex - 1,
          columnIndex: hoveredPixel.columnIndex - 1,
        };
        while (
          leftTopPixelIndex.rowIndex >= indices.topRowIndex &&
          leftTopPixelIndex.columnIndex >= indices.leftColumnIndex
        ) {
          pixelsToColor.push({
            ...leftTopPixelIndex,
            color: "red",
          });
          leftTopPixelIndex = {
            rowIndex: leftTopPixelIndex.rowIndex - 1,
            columnIndex: leftTopPixelIndex.columnIndex - 1,
          };
        }
        let rightTopPixelIndex = {
          rowIndex: hoveredPixel.rowIndex - 1,
          columnIndex: hoveredPixel.columnIndex + 1,
        };
        while (
          rightTopPixelIndex.rowIndex >= indices.topRowIndex &&
          rightTopPixelIndex.columnIndex <= indices.rightColumnIndex
        ) {
          pixelsToColor.push({
            ...rightTopPixelIndex,
            color: "red",
          });
          rightTopPixelIndex = {
            rowIndex: rightTopPixelIndex.rowIndex - 1,
            columnIndex: rightTopPixelIndex.columnIndex + 1,
          };
        }
        let leftBottomPixelIndex = {
          rowIndex: hoveredPixel.rowIndex + 1,
          columnIndex: hoveredPixel.columnIndex - 1,
        };
        while (
          leftBottomPixelIndex.rowIndex <= indices.bottomRowIndex &&
          leftBottomPixelIndex.columnIndex >= indices.leftColumnIndex
        ) {
          pixelsToColor.push({
            ...leftBottomPixelIndex,
            color: "red",
          });
          leftBottomPixelIndex = {
            rowIndex: leftBottomPixelIndex.rowIndex + 1,
            columnIndex: leftBottomPixelIndex.columnIndex - 1,
          };
        }
        let rightBottomPixelIndex = {
          rowIndex: hoveredPixel.rowIndex + 1,
          columnIndex: hoveredPixel.columnIndex + 1,
        };
        while (
          rightBottomPixelIndex.rowIndex <= indices.bottomRowIndex &&
          rightBottomPixelIndex.columnIndex <= indices.rightColumnIndex
        ) {
          pixelsToColor.push({
            ...rightBottomPixelIndex,
            color: "red",
          });
          rightBottomPixelIndex = {
            rowIndex: rightBottomPixelIndex.rowIndex + 1,
            columnIndex: rightBottomPixelIndex.columnIndex + 1,
          };
        }

        colorPixels(pixelsToColor.map((pixel) => ({ ...pixel, color: "red" })));
      }
      // Modify ⬆️
    };
    addCanvasElementEventListener("mousedown", onCanvasClickListener);
    return () => {
      removeCanvasElementEventListener("mousedown", onCanvasClickListener);
    };
  }, [
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
    hoveredPixel,
    indices,
    colorPixels,
    dimensions,
  ]);

  return (
    <div
      style={{
        backgroundColor: "#282c34",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        position: "relative",
      }}
    >
      {hoveredPixel && (
        <div
          style={{
            position: "absolute",
            transform: "translate(50%, 50%)",
            right: "50%",
            top: "10px",
          }}
        >
          You are hoveing rowIndex: {hoveredPixel.rowIndex}, columnIndex:{" "}
          {hoveredPixel.columnIndex}
        </div>
      )}
      <Dotting width={500} height={500} ref={ref} />
    </div>
  );
}

export default App;
