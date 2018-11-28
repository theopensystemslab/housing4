import { getParent, types } from "mobx-state-tree";

const Hanger = types
  .model("Hanger", {
    profile: types.optional(types.array(types.array(types.number)), [
      [0, 0],
      [5, 0],
      [5, 3],
      [2, 5],
      [0, 4]
    ]),
    // width: types.number,
    // height: types.number,
    // length: types.number,

    left: types.number,
    right: types.number,
    front: types.number,
    back: types.number,
    height: types.number, // ridgeHeight
    leftWallHeight: 3,
    rightWallHeight: 4,
    ridgeOffset: 0,
    wallThickness: 0.4

    // minWidth: 3,
    // maxWidth: 8,
    // minHeight: 1,
    // maxHeight: 5,
    // minLength: 1,
    // maxLength: 7
  })
  .views(self => ({
    get project() {
      return getParent(self);
    },
    get width() {
      return Math.abs(self.left - self.right);
    },
    get length() {
      return Math.abs(self.front - self.back);
    },
    //
    get width3d() {
      return self.width * self.project.gridSizeWidth;
    },
    get length3d() {
      return self.length * self.project.gridSizeLength;
    },
    get height3d() {
      return self.height * self.project.gridSizeHeight;
    },
    //
    get floorArea() {
      return self.width3d * self.length3d;
    },
    get claddingArea() {
      return self.length3d * self.height3d * 2;
    },
    get roofingArea() {
      return self.floorArea;
    },
    get internalWidth() {
      return self.width3d - self.wallThickness * 2;
    },
    get internalLength() {
      return self.length3d - self.wallThickness * 2;
    },
    get internalHeight() {
      return self.height3d - self.wallThickness * 2;
    },
    get internalFlooringArea() {
      return self.internalWidth * self.internalLength;
    },
    get internalWallArea() {
      return self.internalHeight * self.internalLength * 2;
    },
    get insulationVolume() {
      return 1;
    }
    // get areaOfOpenings() {
    //   return self.internalWidth * self.internalHeight * 2
    // }
  }))
  .actions(self => ({
    adjust(key, val) {
      self[key] = val;
    }
  }));

export default Hanger;
