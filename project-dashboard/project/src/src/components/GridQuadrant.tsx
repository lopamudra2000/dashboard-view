import React from "react";
import { useDrop } from "react-dnd";
import { Box, Paper, Typography } from "@mui/material";

interface GridQuadrantProps {
  id: string;
  items: Array<{ id: string; content: string }>;
  onDrop: (item: any, quadrantId: string) => void;
}

export const GridQuadrant: React.FC<GridQuadrantProps> = ({
  id,
  items,
  onDrop,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "ITEM",
      drop: (item) => onDrop(item, id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [id, onDrop]
  ); // Add dependencies to ensure the drop target updates

  return (
    <Paper
      ref={drop}
      sx={{
        p: 2,
        minHeight: 200,
        bgcolor: isOver
          ? "primary.50"
          : canDrop
          ? "grey.50"
          : "background.paper",
        border: 2,
        borderColor: isOver
          ? "primary.main"
          : canDrop
          ? "primary.light"
          : "grey.200",
        transition: "all 0.2s",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Quadrant {id}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map((item) => (
          <Paper
            key={item.id}
            sx={{
              p: 2,
              bgcolor: "grey.50",
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <Typography>{item.content}</Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
};
