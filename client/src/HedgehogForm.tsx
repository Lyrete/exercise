import { zodResolver } from "@hookform/resolvers/zod";
import { Female, FemaleOutlined, Male } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Hedgehog,
  NewHedgehog,
  newHedgehogSchema,
  Sex,
} from "@shared/hedgehog";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import { GeoJSON } from "ol/format";
import { Point } from "ol/geom";
import { toLonLat } from "ol/proj";
import { useEffect, useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";

interface Props {
  coordinates: number[];
  addNewHedgehogToList: (e: Hedgehog) => void;
  setCenter: (c: Coordinate) => void;
}

export function HedgehogForm({
  coordinates,
  addNewHedgehogToList,
  setCenter,
}: Props) {
  const [sex, setSex] = useState<Sex>(Sex.Male);
  const [selectedCoord, setSelectedCoord] = useState<Coordinate>(coordinates);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(coordinates);
    setSelectedCoord(coordinates);
  }, [coordinates]);

  const { register, handleSubmit, reset } = useForm<NewHedgehog>({
    resolver: async (data, context, options) => {
      // Inject location to validated data
      const locationData = {
        ...data,
        location: selectedCoord,
        sex,
      };

      return zodResolver(newHedgehogSchema)(locationData, context, options);
    },
  });

  const handleFormSubmit: SubmitHandler<NewHedgehog> = async (data) => {
    const payload = {
      ...data,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/v1/hedgehog", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) return;

      const newHedgehog = (await res.json()) as Hedgehog;
      addNewHedgehogToList(newHedgehog);
    } catch (err) {
      console.error(`Error while sending new hedgehog: ${err}`);
    }
    setLoading(false);
    reset();
  };

  const onError: SubmitErrorHandler<NewHedgehog> = (errors) =>
    console.log(errors);

  return (
    <Paper
      elevation={3}
      sx={{
        margin: "1em 0em 1em 0em",
        padding: "1em",
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit, onError)}>
        <Stack>
          <Typography variant="h5" sx={{ pb: 2 }}>
            Add hedghehog sighting
          </Typography>
          <TextField
            required
            label="Name"
            {...register("name")}
            sx={{ pb: 2 }}
          ></TextField>
          <TextField
            required
            type="number"
            label="Age"
            {...register("age", { valueAsNumber: true })}
            sx={{ pb: 2 }}
          ></TextField>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ pb: 2 }}
          >
            <IconButton
              onClick={() => setSex(Sex.Male)}
              sx={[
                { border: "3px solid transparent" },
                sex === Sex.Male && {
                  border: "3px solid #008000",
                  color: "#008000",
                },
              ]}
            >
              <Male fontSize="large" />
            </IconButton>
            <IconButton
              onClick={() => setSex(Sex.Female)}
              sx={[
                { border: "3px solid transparent" },
                sex === Sex.Female && {
                  border: "3px solid #008000",
                  color: "#008000",
                },
              ]}
            >
              <FemaleOutlined fontSize="large" />
            </IconButton>
          </Stack>
          <Typography variant="overline">Selected coordinates</Typography>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ pb: 2 }}>
            <Typography>
              {selectedCoord.length === 2
                ? toStringHDMS(toLonLat(selectedCoord))
                : "--° --′ --″ - --° --′ --″ -"}
            </Typography>
            <Button
              variant="text"
              color="success"
              onClick={() => setCenter(selectedCoord)}
            >
              Center on
            </Button>
          </Stack>
          <Button variant="contained" type="submit" loading={loading}>
            Add sighting
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
