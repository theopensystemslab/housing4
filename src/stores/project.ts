import { types } from "mobx-state-tree";
import Building from "./building";
import Location from "./location";

const Project = types.model("Project", {
  id: types.identifier,
  name: types.string,
  description: types.string,
  // owner: Team,
  defaultCurrency: "EUR",
  location: types.maybe(Location),
  building: types.maybe(Building)
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
