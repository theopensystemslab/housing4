import { groupBy } from "lodash-es";
import { reaction } from "mobx";
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

    const {
      hanger: { width3d, height3d, length3d, profile }
    } = props.project;

    // console.log(profile);

    // const p = observable(profile);
    // autorun(() => console.log(profile));
    reaction(
      () => props.project.hanger.profile,
      profile => console.log(profile),
      { fireImmediately: true, delay: 200 }
    );

    const shape = new THREE.Shape(
      profile.map(([x, y]) => new THREE.Vector2(x, y))
    );

    this.geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    // console.log(shape);

    this.geometry.translate(0, height3d / 2, 0);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    const edgesGeometry = new THREE.EdgesGeometry(this.geometry, 1);
    const lineSegments = new THREE.LineSegments(edgesGeometry, edgeMaterial);
    this.mesh.add(lineSegments);

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
}

export default compose(
  inject("scene", "project"),
  observer
)(Hanger);
