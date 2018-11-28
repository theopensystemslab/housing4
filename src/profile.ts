import {
  Clipper,
  ClipperOffset,
  EndType,
  JoinType,
  Path
} from "clipper-fpoint";

export function area(path) {
  return Clipper.Area(path);
}

export function offset(path, delta) {
  var solution = new Path();
  var co = new ClipperOffset(2, 0.25);
  co.AddPath(path, JoinType.jtMiter, EndType.etClosedPolygon);
  co.Execute(solution, delta);
  return solution[0];
}

export const xyToPair = ({ X, Y }) => [X, Y];

export const pairToXY = ([X, Y]) => ({ X, Y });

// var path2 = [
//   { X: 10, Y: 10 },
//   { X: 110, Y: 10 },
//   { X: 110, Y: 110 },
//   { X: 10, Y: 110 }
// ];

// console.log(path2.map(xyToPair));
// console.log(path2.map(xyToPair).map(pairToXY));

// console.log(area(path2));
// console.log(area(offset(path2, 3)));
