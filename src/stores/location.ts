import { types } from "mobx-state-tree";

const Location = types.model("Location", {
  countryCode: types.string,
  region: types.string,
  address: types.string,
  postcode: types.string
});

export default Location;
