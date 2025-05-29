import { HedgehogForm } from "./HedgehogForm";
import { HedgehogInfo } from "./HedgehogInfo";
import HedgeHogList from "./HedgehogList";
import { Map } from "./Map";
import { Box, Paper, Typography } from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";
import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import { useEffect, useState } from "react";

export function App() {
  // Latest coordinates from the Map click event
  const [coordinates, setCoordinates] = useState<number[]>();
  // ID of the currently selected hedgehog
  const [selectedHedgehogId, setSelectedHedgehogId] = useState<number | null>(
    null
  );
  const [geometries, setGeometries] = useState<GeoJSON.Geometry[]>([]);

  const [hedgehogs, setHedgehogs] = useState<Hedgehog[]>([]);
  const addHedgehog = (toAdd: Hedgehog) => {
    setHedgehogs([...hedgehogs, toAdd]);
  };

  const [center, setCenter] = useState<Coordinate>([
    2659167.020281517, 9632038.56757201,
  ]);

  // Fetch all hedgehog's during startup
  useEffect(() => {
    const getAllHedgehogs = async () => {
      try {
        const res = await fetch("/api/v1/hedgehog");
        if (!res.ok) return;

        const json = await res.json();
        setHedgehogs(json?.hedgehogs || []);
      } catch (err) {
        console.error(`Error while fetching hedgehogs: ${err}`);
      }
    };

    getAllHedgehogs();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "white" }} variant="overline">
          Siilit kartalla
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridAutoColumns: "1fr 1.5fr 2fr",
          gridAutoFlow: "column",
          overflow: "hidden",
        }}
      >
        <HedgeHogList
          setSelectedHedgehogId={setSelectedHedgehogId}
          hedgehogs={hedgehogs}
        />
        <Box>
          <HedgehogInfo
            hedgehogId={selectedHedgehogId}
            setShownHedgehogLocations={setGeometries}
            setCenter={setCenter}
          />
          <HedgehogForm
            coordinates={coordinates || []}
            addNewHedgehogToList={addHedgehog}
            setCenter={setCenter}
          />
        </Box>
        <Paper elevation={3} sx={{ margin: "1em" }}>
          <Map
            onMapClick={(coordinates) => setCoordinates(coordinates)}
            // Esimerkki siitä, miten kartalle voidaan välittää siilien koordinaatteja GeoJSON -arrayssä
            geometries={geometries}
            center={center}
          />
        </Paper>
      </Box>
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <Typography sx={{ color: "white" }} variant="overline">
          Powered by Ubigu Oy
        </Typography>
      </Box>
    </Box>
  );
}
