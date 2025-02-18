import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GridLayout from "react-grid-layout";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { DraggableItem } from "./components/DraggableItem";
import { GridQuadrant } from "./components/GridQuadrant";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface Item {
  id: string;
  content: string;
}

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PageData {
  quadrantItems: Record<string, Item[]>;
  layout: LayoutItem[];
}

function App() {
  const [sourceItems, setSourceItems] = useState<Item[]>([
    { id: "1", content: "Item 1" },
    { id: "2", content: "Item 2" },
    { id: "3", content: "Item 3" },
    { id: "4", content: "Item 4" },
    { id: "5", content: "Item 5" },
    { id: "6", content: "Item 6" },
    { id: "7", content: "Item 7" },
    { id: "8", content: "Item 8" },
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PageData[]>([
    {
      quadrantItems: {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
      },
      layout: [
        { i: "1", x: 0, y: 0, w: 6, h: 6 },
        { i: "2", x: 6, y: 0, w: 6, h: 6 },
        { i: "3", x: 0, y: 6, w: 6, h: 6 },
        { i: "4", x: 6, y: 6, w: 6, h: 6 },
      ],
    },
  ]);

  const [summary, setSummary] = useState<string>("");

  const isCurrentPageFull = () => {
    const currentPageData = pages[currentPage];
    return Object.values(currentPageData.quadrantItems).every(
      (items) => items.length > 0
    );
  };

  const addNewPage = () => {
    setPages((prev) => [
      ...prev,
      {
        quadrantItems: {
          "1": [],
          "2": [],
          "3": [],
          "4": [],
        },
        layout: [
          { i: "1", x: 0, y: 0, w: 6, h: 6 },
          { i: "2", x: 6, y: 0, w: 6, h: 6 },
          { i: "3", x: 0, y: 6, w: 6, h: 6 },
          { i: "4", x: 6, y: 6, w: 6, h: 6 },
        ],
      },
    ]);
    setCurrentPage((prev) => prev + 1);
  };

  const handleDrop = React.useCallback(
    (item: Item, quadrantId: string) => {
      setSourceItems((prev) => prev.filter((i) => i.id !== item.id));
      setPages((prev) => {
        const newPages = [...prev];
        newPages[currentPage] = {
          ...newPages[currentPage],
          quadrantItems: {
            ...newPages[currentPage].quadrantItems,
            [quadrantId]: [
              ...newPages[currentPage].quadrantItems[quadrantId],
              item,
            ],
          },
        };
        return newPages;
      });
    },
    [currentPage]
  );

  const handleLayoutChange = React.useCallback(
    (newLayout: LayoutItem[]) => {
      setPages((prev) => {
        const newPages = [...prev];
        newPages[currentPage] = {
          ...newPages[currentPage],
          layout: newLayout,
        };
        return newPages;
      });
    },
    [currentPage]
  );

  const handleSubmit = () => {
    let summaryText = "Layout Summary:\n\n";

    pages.forEach((page, pageIndex) => {
      summaryText += `Page ${pageIndex + 1}:\n`;
      const sortedLayout = [...page.layout].sort((a, b) => {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
      });

      sortedLayout.forEach((layout, index) => {
        const quadrantId = layout.i;
        const items = page.quadrantItems[quadrantId];
        const position = index + 1;

        summaryText += `  Position ${position} - Quadrant ${quadrantId}:\n`;
        if (items.length === 0) {
          summaryText += "    • No items\n";
        } else {
          items.forEach((item) => {
            summaryText += `    • ${item.content}\n`;
          });
        }
      });
      summaryText += "\n";
    });

    setSummary(summaryText);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.100" }}>
        {/* Left Sidebar */}
        <Paper
          sx={{
            width: "25%",
            p: 3,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Available Items
          </Typography>

          <Box sx={{ mb: 3 }}>
            {sourceItems.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <DraggableItem id={item.id} content={item.content} />
              </Box>
            ))}
          </Box>

          <Button variant="contained" onClick={handleSubmit} sx={{ mb: 2 }}>
            Submit
          </Button>

          {summary && (
            <Paper
              sx={{
                p: 2,
                bgcolor: "grey.50",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                overflow: "auto",
                maxHeight: "400px",
              }}
            >
              {summary}
            </Paper>
          )}
        </Paper>

        {/* Right Grid Layout */}
        <Box sx={{ width: "75%", p: 3, overflow: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">
              Page {currentPage + 1} of {pages.length}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 0}
                sx={{ mr: 1 }}
              >
                Previous Page
              </Button>
              <Button
                variant="outlined"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === pages.length - 1}
                sx={{ mr: 1 }}
              >
                Next Page
              </Button>
              {isCurrentPageFull() && currentPage === pages.length - 1 && (
                <Button
                  variant="contained"
                  onClick={addNewPage}
                  color="primary"
                >
                  Add New Page
                </Button>
              )}
            </Box>
          </Box>
          <Paper sx={{ p: 3 }}>
            <GridLayout
              className="layout"
              layout={pages[currentPage].layout}
              cols={12}
              rowHeight={30}
              width={900}
              isResizable={false}
              margin={[20, 20]}
              onLayoutChange={handleLayoutChange}
            >
              {pages[currentPage].layout.map((l) => (
                <div key={l.i}>
                  <GridQuadrant
                    id={l.i}
                    items={pages[currentPage].quadrantItems[l.i]}
                    onDrop={handleDrop}
                  />
                </div>
              ))}
            </GridLayout>
          </Paper>
        </Box>
      </Box>
    </DndProvider>
  );
}

export default App;
