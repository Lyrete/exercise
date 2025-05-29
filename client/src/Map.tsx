import { GlobalStyles } from "@mui/material";
import { View, Map as OlMap, Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import { GeoJSON } from "ol/format";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector";
import { Circle } from "ol/style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children?: ReactNode;
  geometries?: GeoJSON.Geometry[];
  onMapClick: (coordinates: number[]) => void;
  center: Coordinate;
}

export function Map({ children, onMapClick, geometries, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  /**
   * OpenLayers View: @see https://openlayers.org/en/latest/apidoc/module-ol_View-View.html
   * View's projection is defined based on the target country (area): E.g. EPSG:3067 in Finland
   */
  const [olView] = useState(() => {
    return new View({
      center: [2659167.020281517, 9632038.56757201],
      zoom: 5,
      multiWorld: false,
      enableRotation: false,
    });
  });

  /**
   * OpenLayers Map: @see https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
   * "For a map to render, a view, one or more layers, and a target container are needed" -docs
   */
  const [olMap] = useState(() => {
    return new OlMap({
      target: "",
      controls: [],
      view: olView,
      keyboardEventTarget: document,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource(),
          style: new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({ color: "#00B2A0" }),
              stroke: new Stroke({ color: "darkblue", width: 3 }),
            }),
          }),
        }),
        // Current selection layer
        new VectorLayer({
          source: new VectorSource(),
          style: new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({ color: "#FF6F00" }),
              stroke: new Stroke({ color: "black", width: 3 }),
            }),
          }),
        }),
      ],
    });
  });

  useEffect(() => {
    const view = olMap.getView();
    view.setCenter(center);
  }, [center]);

  /** olMap -object's initialization on startup  */
  useEffect(() => {
    olMap.setTarget(mapRef.current as HTMLElement);
    const layers = olMap.getLayers().getArray();
    const selectionLayer = (layers[2] as VectorLayer<VectorSource>).getSource();

    olMap.on("click", (event) => {
      const feature = new Feature({
        geometry: new Point(event.coordinate),
      });
      onMapClick(event.coordinate);
      selectionLayer?.set;
      selectionLayer?.clear();
      selectionLayer?.addFeature(feature);
    });
  }, [olMap]);

  /** Listen for changes in the 'features' property */
  useEffect(() => {
    if (!geometries || !geometries.length) return;
    const layers = olMap.getLayers().getArray();

    const source = (layers[1] as VectorLayer<VectorSource>).getSource();
    const olFeatures = geometries.map(
      (geometry) =>
        new Feature({
          geometry: new GeoJSON().readGeometry(geometry),
        })
    );
    source?.clear();
    source?.addFeatures(olFeatures);
  }, [geometries]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Styles for the OpenLayers ScaleLine -component */}
      <GlobalStyles
        styles={{
          ".ol-viewport": {
            cursor: "pointer",
          },
        }}
      />
      <div
        style={{ width: "100%", height: "100%", position: "relative" }}
        ref={mapRef}
      >
        {children}
      </div>
    </div>
  );
}
