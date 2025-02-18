import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridLayout from 'react-grid-layout';
import { DraggableItem } from './components/DraggableItem';
import { GridQuadrant } from './components/GridQuadrant';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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

function App() {
  const [sourceItems, setSourceItems] = useState<Item[]>([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
    { id: '5', content: 'Item 5' },
  ]);

  const [quadrantItems, setQuadrantItems] = useState<Record<string, Item[]>>({
    '1': [],
    '2': [],
    '3': [],
    '4': [],
  });

  const [currentLayout, setCurrentLayout] = useState<LayoutItem[]>([
    { i: '1', x: 0, y: 0, w: 6, h: 6 },
    { i: '2', x: 6, y: 0, w: 6, h: 6 },
    { i: '3', x: 0, y: 6, w: 6, h: 6 },
    { i: '4', x: 6, y: 6, w: 6, h: 6 },
  ]);

  const [summary, setSummary] = useState<string>('');

  const handleDrop = (item: Item, quadrantId: string) => {
    setSourceItems((prev) => prev.filter((i) => i.id !== item.id));
    setQuadrantItems((prev) => ({
      ...prev,
      [quadrantId]: [...prev[quadrantId], item],
    }));
  };

  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setCurrentLayout(newLayout);
  };

  const handleSubmit = () => {
    // Sort layout by position (top to bottom, left to right)
    const sortedLayout = [...currentLayout].sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    });

    // Generate summary
    let summaryText = "Current Layout Summary:\n\n";
    
    sortedLayout.forEach((layout, index) => {
      const quadrantId = layout.i;
      const items = quadrantItems[quadrantId];
      const position = index + 1;
      
      summaryText += `Position ${position} - Quadrant ${quadrantId}:\n`;
      if (items.length === 0) {
        summaryText += "• No items\n";
      } else {
        items.forEach(item => {
          summaryText += `• ${item.content}\n`;
        });
      }
      summaryText += "\n";
    });

    setSummary(summaryText);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Left Sidebar */}
          <div className="w-1/4 p-6 bg-white border-r border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Available Items</h2>
            <div className="space-y-3">
              {sourceItems.map((item) => (
                <DraggableItem key={item.id} id={item.id} content={item.content} />
              ))}
            </div>
            
            <button
              onClick={handleSubmit}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg
                shadow-sm hover:bg-blue-700 transition-colors duration-200"
            >
              Submit
            </button>

            {summary && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {summary}
                </pre>
              </div>
            )}
          </div>

          {/* Right Grid Layout */}
          <div className="w-3/4 p-6 overflow-auto">
            <GridLayout
              className="layout bg-white p-6 rounded-xl shadow-lg"
              layout={currentLayout}
              cols={12}
              rowHeight={30}
              width={900}
              isResizable={false}
              margin={[20, 20]}
              onLayoutChange={handleLayoutChange}
            >
              {currentLayout.map((l) => (
                <div key={l.i}>
                  <GridQuadrant
                    id={l.i}
                    items={quadrantItems[l.i]}
                    onDrop={handleDrop}
                  />
                </div>
              ))}
            </GridLayout>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;