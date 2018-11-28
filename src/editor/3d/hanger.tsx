import { groupBy } from "lodash-es";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { compose } from "recompose";
import * as THREE from "three";
import Surface from "./surface";

const extrudeSettings = {
  depth: 10,
  steps: 1,
  bevelEnabled: false
};

const edgeMaterial = new THREE.LineBasicMaterial({
  color: 0x000000,
  linewidth: 1,
  transparent: false
});

class Hanger extends React.Component<{ scene: THREE.Scene; project: any }> {
  private bbox: THREE.Box3 = new THREE.Box3();
  private mesh: THREE.Mesh;
  private geometry;
  private surfaces: Surface[] = [];
  private material = new THREE.MeshBasicMaterial({
    opacity: 0.7,
    transparent: true,
    // vertexColors: THREE.FaceColors,
    color: 0xffffff,
    side: THREE.DoubleSide
    // depthTest: false
  });

  constructor(props) {
    super(props);

    const { width3d, height3d, length3d } = props.project.hanger;

    const shape = new THREE.Shape(
      props.project.hanger.profile.map(([x, y]) => new THREE.Vector2(x, y))
    );

    this.geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    // console.log(shape);

    this.geometry.translate(0, height3d / 2, 0);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // const boxGeometry = new THREE.BoxGeometry(width3d, height3d, length3d);
    // boxGeometry.translate(0, height3d, 0);
    // const mesh = new THREE.Mesh(boxGeometry, this.material);
    // this.mesh.add(mesh);

    const edgesGeometry = new THREE.EdgesGeometry(this.geometry, 1);
    const lineSegments = new THREE.LineSegments(edgesGeometry, edgeMaterial);
    this.mesh.add(lineSegments);
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

  componentDidMount() {
    this.props.scene.add(this.mesh);
  }

  componentWillUnmount() {
    this.props.scene.remove(this.mesh);
  }

  render() {
    return null;
  }

  // handleMouseOver(intersection) {
  //   this.material.opacity = 1;
  //   intersection.face.surface.focus();
  //   this.geometry.colorsNeedUpdate = true;
  // }

  // handleMouseOut() {
  //   this.material.opacity = 0.5;
  // }
}

export default compose(
  inject("scene", "project"),
  observer
)(Hanger);
