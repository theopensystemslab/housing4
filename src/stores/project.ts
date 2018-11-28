import { types } from "mobx-state-tree";
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
    hanger: Hanger
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
    }
  }));

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
