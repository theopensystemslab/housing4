import { types } from "mobx-state-tree";
import Hanger from "./hanger";

const GRID_SIZE = 0.3;
// const GRID_SIZE_WIDTH = GRID_SIZE;
// const GRID_SIZE_HEIGHT = GRID_SIZE;
// const GRID_SIZE_LENGTH = GRID_SIZE * 4;

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
      return GRID_SIZE;
    },
    get gridSizeWidth() {
      return GRID_SIZE;
    },
    get gridSizeHeight() {
      return GRID_SIZE;
    },
    get gridSizeLength() {
      return GRID_SIZE * 4;
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
