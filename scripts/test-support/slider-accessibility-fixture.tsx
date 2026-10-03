import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Slider } from "../../src/components/ui/slider";

function Fixture() {
  const [distance, setDistance] = useState([4]);
  const [price, setPrice] = useState([1, 4]);
  return <>
    <section data-testid="distance">
      <Slider min={0} max={8} step={1} value={distance} onValueChange={setDistance} aria-label="Travel distance" data-root="distance" />
      <output>{distance.join(",")}</output>
    </section>
    {["Cozy to adventurous", "Familiar to adventurous", "Chill to lively"].map(label =>
      <Slider key={label} min={0} max={100} step={1} defaultValue={[50]} aria-label={label} />)}
    <Slider min={1} max={4} step={1} minStepsBetweenThumbs={0} value={price} onValueChange={setPrice} aria-label="Price range" />
    <output data-testid="price">{price.join(",")}</output>
    <span id="external-label">External distance</span>
    <Slider defaultValue={[25]} aria-label="Ignored fallback" aria-labelledby="external-label" />
    <span id="range-label">External range</span>
    <Slider defaultValue={[10, 90]} aria-labelledby="range-label" />
    <Slider defaultValue={[10, 50, 90]} aria-label="Three values" />
  </>;
}

createRoot(document.getElementById("root")!).render(<Fixture />);
