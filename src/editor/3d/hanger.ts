import { groupBy } from "lodash-es";
import * as THREE from "three";
import Surface from "./surface";

const GRID_SIZE = 0.3;
const GRID_SIZE_WIDTH = GRID_SIZE;
const GRID_SIZE_HEIGHT = GRID_SIZE;
const GRID_SIZE_LENGTH = GRID_SIZE * 4;

class Hanger {
  bbox: THREE.Box3 = new THREE.Box3();
  mesh: THREE.Mesh;
  geometry;
  surfaces: Surface[] = [];

  material = new THREE.MeshBasicMaterial({
    opacity: 0.5,
    transparent: true,
    vertexColors: THREE.FaceColors,
    color: 0xff0000
    // side: THREE.DoubleSide
  });

  constructor(private editor) {
    const height = GRID_SIZE_HEIGHT * 9;
    this.geometry = new THREE.BoxGeometry(
      GRID_SIZE_WIDTH * 5,
      height,
      GRID_SIZE_LENGTH
    );
    this.geometry.translate(0, height / 2, 0);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // geometry.computeFaceNormals();
    // this.mesh.matrixAutoUpdate = true;
    // this.mesh.position.setY(GRID_SIZE / 2);
    // this.mesh.updateMatrixWorld(false);
    // this.mesh.matrixWorldNeedsUpdate = true;
    // this.geometry.computeFaceNormals();
    // this.geometry.computeBoundingSphere();
    //
    // const groupedFaces = this.geometry.faces.reduce((acc, curr) => {
    //   console.log(face);
    //   return acc;
    // }, []);
    const groupedFaces = groupBy(this.geometry.faces, "materialIndex");
    Object.keys(groupedFaces).forEach(key => {
      const faces = groupedFaces[key];
      const vertices = faces.reduce((set, f) => {
        // if (!f.color.equals(this.active.model.faceActiveColor)) {
        //   this.faceColor$.next([f, this.props.colors.faceActive]);
        // }
        set.add(this.geometry.vertices[f.a]);
        set.add(this.geometry.vertices[f.b]);
        set.add(this.geometry.vertices[f.c]);
        return set;
      }, new Set());
      this.surfaces.push(new Surface(this, faces, Array.from(vertices)));
    });
  }

  handleMouseOver(intersection) {
    this.material.opacity = 1;
    intersection.face.surface.focus();
    this.geometry.colorsNeedUpdate = true;
  }

  handleMouseOut() {
    this.material.opacity = 0.5;
  }
}

export default Hanger;
