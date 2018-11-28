import { Provider } from "mobx-react";
import * as React from "react";
import { Scene } from "THREE";
import Info from "./components/info";
import Editor from "./editor";
import Project from "./stores/project";

const scene = new Scene();

const project = Project.create({
  id: "1",
  name: "Pionierswoning WHAlm",
  description: "Tiny House",
  defaultCurrency: "EUR",
  hanger: {
    left: -3,
    right: 3,
    front: 1,
    back: -1,
    height: 4
  }
  // location: Location.create({
  //   countryCode: "NL",
  //   region: "Flevoland",
  //   address: "Alseidenstraat 6",
  //   postcode: "B-1047"
  // }),
  // building: Building.create({
  //   numStoreys: 2,
  //   numBedrooms: 2,
  //   numOccupants: 2,
  //   frameWidth: 18,
  //   external: {
  //     width: 300,
  //     length: 300
  //   }
  // })
});

export default function App() {
  return (
    <Provider project={project} scene={scene}>
      <React.Fragment>
        <Info />
        <Editor />
      </React.Fragment>
    </Provider>
  );
}
