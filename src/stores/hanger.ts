import { getParent, types } from "mobx-state-tree";
import { area, offset, pairToXY, xyToPair } from "../profile";

Math.getDistance = function([x1, y1], [x2, y2]) {
  var xs = x2 - x1,
    ys = y2 - y1;

  xs *= xs;
  ys *= ys;

  return Math.sqrt(xs + ys);
};

const Hanger = types
  .model("Hanger", {
    // width: types.number,
    // height: types.number,
    // length: types.number,

    left: types.number,
    right: types.number,
    front: types.number,
    back: types.number,
    height: types.number, // ridgeHeight
    leftWallHeight: 3.1,
    rightWallHeight: 3.1,
    ridgeOffset: 0,
    wallThickness: 0.4,
    ridgeHeight: 3.7,
    bayCount: 2,
    width: 4.2

    // minWidth: 3,
    // maxWidth: 8,
    // minHeight: 1,
    // maxHeight: 5,
    // minLength: 1,
    // maxLength: 7
  })
  .views(self => ({
    get profile() {
      const halfWidth = self.width / 2;
      return [
        [-halfWidth, 0],
        [halfWidth, 0],
        [halfWidth, self.rightWallHeight],
        [self.ridgeOffset, self.ridgeHeight],
        [-halfWidth, self.leftWallHeight]
      ];
    },
    get profileArea() {
      return area(self.profile.map(pairToXY));
    },
    get innerProfile() {
      return offset(self.profile.map(pairToXY), -self.wallThickness).map(
        xyToPair
      );
    },
    get innerProfileArea() {
      return area(self.innerProfile.map(pairToXY));
    },
    get project() {
      return getParent(self);
    },
    // get width() {
    //   return Math.abs(self.left - self.right);
    // },
    get length() {
      // return Math.abs(self.front - self.back);
      return self.bayCount * self.project.gridSizeLength;
    },
    //
    // get width3d() {
    //   return self.width * self.project.gridSizeWidth;
    // },
    // get length3d() {
    //   return self.bayCount * self.project.gridSizeLength;
    // },
    // get height3d() {
    //   return self.height * self.project.gridSizeHeight;
    // },
    //
    get floorArea() {
      return self.width * self.length;
    },
    get claddingArea() {
      return (
        self.length * self.leftWallHeight +
        self.profileArea * 2 +
        self.length * self.rightWallHeight
      );
    },
    get roofingArea() {
      const pts = self.profile.filter(([x, y]) => y > 0);

      return (
        (Math.getDistance(pts[0], pts[1]) + Math.getDistance(pts[1], pts[2])) *
        self.length
      );
    },
    get internalWidth() {
      return self.width - self.wallThickness * 2;
    },
    get internalLength() {
      return self.length - self.wallThickness * 2;
    },
    get internalHeight() {
      return self.ridgeHeight - self.wallThickness * 2;
    },
    get internalFlooringArea() {
      return self.internalWidth * self.internalLength;
    },
    get internalWallArea() {
      return (
        (self.leftWallHeight - self.wallThickness * 2) * self.internalLength +
        (self.rightWallHeight - self.wallThickness * 2) * self.internalLength
      );
    },
    get insulationVolume() {
      return self.profileArea * self.length - self.innerProfileArea * self.internalLength;
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
