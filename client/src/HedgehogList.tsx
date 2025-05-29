import { Box, MenuItem, Paper, Typography } from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";
import { useEffect, useState } from "react";

interface HedgehogListProps {
  setSelectedHedgehogId: (id: number) => void;
  hedgehogs: Hedgehog[];
}

export default function HedgeHogList({
  setSelectedHedgehogId,
  hedgehogs,
}: HedgehogListProps) {
  const [listedHedgehogs, setHedgehogs] = useState<Hedgehog[]>([]);

  useEffect(() => {
    setHedgehogs(hedgehogs);
  }, [hedgehogs]);

  return (
    <Paper elevation={3} sx={{ margin: "1em", overflow: "hidden" }}>
      <Box
        sx={{
          backgroundColor: "#a1e6df",
          height: "3em",
          display: "flex",
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "darkslategrey" }}>
          Rekisteröidyt siilit
        </Typography>
      </Box>
      {listedHedgehogs.length ? (
        <Box sx={{ overflowY: "scroll", height: "100%" }}>
          {listedHedgehogs.map((hedgehog, index: number) => (
            <MenuItem
              key={`hedgehog-index-${index}`}
              onClick={() => setSelectedHedgehogId(hedgehog.id)}
            >
              {hedgehog.name}
            </MenuItem>
          ))}
        </Box>
      ) : (
        <Typography sx={{ padding: "1em" }}>No hedgehogs found :(</Typography>
      )}
    </Paper>
  );
}
