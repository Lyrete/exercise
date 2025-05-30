import { Female, Male } from "@mui/icons-material";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { Hedgehog, HedgehogFeature, Sex } from "@shared/hedgehog";
import Feature from "ol/Feature";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import { GeoJSON } from "ol/format";
import Point from "ol/geom/Point";
import { toLonLat } from "ol/proj";
import { useEffect, useState } from "react";

interface Props {
  hedgehogId: number | null;
  setShownHedgehogLocations: (features: GeoJSON.Geometry[]) => void;
  setCenter: (newCenter: Coordinate) => void;
}

export function HedgehogInfo({
  hedgehogId,
  setShownHedgehogLocations,
  setCenter,
}: Props) {
  const [visibleHedgehog, setVisibleHedgehog] = useState<Hedgehog | null>(null);

  useEffect(() => {
    const getHedgehogFullInfo = async () => {
      if (!hedgehogId) return;

      try {
        const res = await fetch(`/api/v1/hedgehog/${hedgehogId}`);
        if (!res.ok) return;

        const json = (await res.json()) as Hedgehog;
        console.log(json);
        setVisibleHedgehog(json);
        setShownHedgehogLocations([json.location]);
      } catch (err) {
        console.error(`Error while fetching hedgehogs: ${err}`);
      }
    };
    getHedgehogFullInfo();
  }, [hedgehogId]);

  return (
    <Paper
      elevation={3}
      sx={{
        margin: "1em 0em 1em 0em",
        padding: "1em",
      }}
    >
      {visibleHedgehog ? (
        <Stack>
          <Typography variant="overline">Name</Typography>
          <Typography>{visibleHedgehog.name}</Typography>
          <Typography variant="overline">Age</Typography>
          <Typography>{visibleHedgehog.age}</Typography>
          <Typography variant="overline">Sex</Typography>
          <Typography>
            {visibleHedgehog.sex === Sex.Male && <Male></Male>}
            {visibleHedgehog.sex === Sex.Female && <Female></Female>}
          </Typography>
          <Typography variant="overline">Location</Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>
              {visibleHedgehog.location &&
                toStringHDMS(toLonLat(visibleHedgehog.location.coordinates))}
            </Typography>
            <Button
              variant="text"
              color="success"
              onClick={() => setCenter(visibleHedgehog.location.coordinates)}
            >
              Center on
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Typography>Choose a hedgehog from the left to see details</Typography>
      )}
    </Paper>
  );
}
