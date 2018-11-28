import { groupBy } from "lodash-es";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { compose } from "recompose";
import * as THREE from "three";
import Surface from "./surface";

class Hanger extends React.Component<{ scene: THREE.Scene; project: any }> {
  private bbox: THREE.Box3 = new THREE.Box3();
  private mesh: THREE.Mesh;
  private geometry;
  private surfaces: Surface[] = [];
  private material = new THREE.MeshBasicMaterial({
    opacity: 0.5,
    transparent: true,
    vertexColors: THREE.FaceColors,
    color: 0xff0000
    // side: THREE.DoubleSide
  });

  constructor(props) {
    super(props);

    const { width3d, height3d, length3d } = props.project.hanger;

    this.geometry = new THREE.BoxGeometry(width3d, height3d, length3d);
    this.geometry.translate(0, height3d / 2, 0);
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
