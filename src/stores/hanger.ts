import { types } from "mobx-state-tree";

const Hanger = types
  .model("Hanger", {
    width: types.number,
    height: types.number,
    length: types.number,
    minWidth: 3,
    maxWidth: 8,
    minHeight: 1,
    maxHeight: 5,
    minLength: 1,
    maxLength: 7
  })
  .views(self => ({
    get floorArea() {
      return self.width * self.height;
    }
  }));

export default Hanger;
