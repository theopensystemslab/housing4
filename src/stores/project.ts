import { post } from "axios";
import { flow, types } from "mobx-state-tree";
import Hanger from "./hanger";

const Project = types
  .model("Project", {
    id: types.identifier,
    name: types.string,
    description: types.string,
    defaultCurrency: "EUR",
    // owner: Team,
    // location: types.maybe(Location),
    // building: types.maybe(Building),
    hanger: Hanger,
    state: types.optional(
      types.enumeration("State", ["updating", "done", "error"]),
      "done"
    )
  })
  .views(self => ({
    get gridSize() {
      return 0.3;
    },
    get gridSizeWidth() {
      return self.gridSize;
    },
    get gridSizeHeight() {
      return self.gridSize;
    },
    get gridSizeLength() {
      return self.gridSize * 4;
    },
    get buttonText() {
      switch (self.state) {
        case "updating":
          return "Updating engine...";
        case "done":
          return "Save to engine →";
        case "error":
          return "There was an error";
      }
    }
  }))
  .actions(self => {
    const updateSpreadSheet = flow(function*() {
      try {
        self.state = "updating";
        yield post("https://patternweb-google-sheets.herokuapp.com/update", {
          range: "Dashboard!C6:D47",
          values: [
            ["12345"], // Project ID
            ["H4.0 Demo"], // Project name
            ["From presentation"], // Project description
            ["Alastair Parvin"], // Project owner
            ["Open Systems Lab"], // Owner type
            ["€ EURO"], // Base currency
            ["United Kingdom"], // Country
            ["London"], // Region
            ["217 Mare Street"], // Address
            ["E8 3QE"], // Postcode
            [], // BUILDING GEOMETRY
            [self.hanger.width], // Internal Width (X)
            [self.hanger.length], // Internal Length (Y)
            [], // Gross Internal Floor area
            [self.hanger.leftWallHeight], // Internal wall height 1
            [self.hanger.rightWallHeight], // Internal wall height 2
            [self.hanger.height], // Ridge Height
            [self.hanger.ridgeOffset], // Ridge offset from centre
            [1], // Number of storeys
            [], // Stair void area
            [], // Glazing area
            [], // First floor level height
            [self.hanger.wallThickness], // External wall thickness
            [self.hanger.wallThickness], // Floor depth / thickness
            [self.hanger.wallThickness], // Roof buildup / thickness
            [], // Window/Door area
            [], // Foundation Type
            [1], // Number of bedrooms
            [1], // Number of occupants
            [], //
            [], // Outputs
            [], // Name
            [], // BUILDING INFO
            [undefined, self.hanger.insulationVolume], // Insulation Volume
            [], // Building Footprint Area
            [undefined, self.hanger.claddingArea], // Cladding Area
            [undefined, self.hanger.roofingArea], // Roofing Area
            [], // Int Flooring Area
            [undefined, self.hanger.internalWallArea], // Int Wall Area
            [undefined, self.hanger.internalWallArea], // Int Roof Area
            [], // Area of Openings
            [] // Mass of Superstructure
          ]
        });
        self.state = "done";
        // alert("done");
        // window.location.href =
        //   "https://docs.google.com/spreadsheets/d/119SPX1Qj1uRr1aYfPp8xm9wCi7XHkPGlp5bQOUsPtwM/edit#gid=0";
      } catch (e) {
        self.state = "error";
        console.error(e);
      }
    });

    return {
      updateSpreadSheet
    };
  });

export default Project;

// Name,Variable
// Project ID,
// Project name,projectName
// Project description,
// Project owner,projectOwner
// Owner type,
// Base currency,
// Country,
// Region,
// Address,address
// Postcode,postcode
