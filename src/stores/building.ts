import { types } from "mobx-state-tree";

// const InternalDimensions = types.model({
//   width: types.number,
//   height: types.number,
//   floorArea: types.number,
//   wallHeight: types.number,
//   areas: types.model({
//     stairVoidArea: types.number,
//     glazingArea: types.number
//   }),
//   // external
//   ridgeHeight: types.number,
//   ridgeCenterOffset: types.number
// });

const Building = types
  .model("Building", {
    // energyCalculator: types.maybe(EnergyCalculator),
    numStoreys: types.integer,
    numBedrooms: types.integer,
    numOccupants: types.integer,
    frameWidth: types.number,
    external: types.model({
      width: types.number,
      length: types.number,
      wallHeight1: types.number,
      wallHeight2: types.number,
      ridgeHeight: types.number,
      ridgeOffsetFromCenter: types.number,
      firstFloorLevelHeight: types.number,
      wallThickness: types.number,
      floorThickness: types.number,
      roofThickness: types.number
    })
  })
  .views(self => ({
    get internal() {
      return {
        width: self.external.width - self.frameWidth * 2,
        length: self.external.length - self.frameWidth * 2
        // wallArea,
        // roofArea
      };
    }
    // floorArea(key) {
    //   return self[key].width * self[key].length;
    // },
    // get insulationVolume() {
    //   // todo
    //   return 1;
    // },
    // get claddingArea() {
    //   // todo
    //   return 1;
    // },
    // get areaOfOpenings() {
    //   return 1;
    // },
    // get massOfSuperstructure() {
    //   return 1;
    // }
  }));

export default Building;

// Internal Width (X),widthInternal
// Internal Length (Y),lengthInternal
// Gross Internal Floor area,floorSize
// Internal wall height 1,
// Internal wall height 2,
// Ridge Height,heightRidge
// Ridge offset from centre,
// Number of storeys,numberOfStoreys
// Stair void area,
// Glazing area,
// First floor level height,heightFirstFloorLevel
// External wall thickness,
// Floor depth / thickness,
// Roof buildup / thickness,
// Window/Door area,
// Foundation Type,
// Number of bedrooms,numberOfBedrooms
// Number of occupants,
