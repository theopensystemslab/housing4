import * as THREE from "three";

class Surface {
  private originalVertices;

  constructor(
    private hanger,
    private faces: THREE.Face3[],
    private vertices: THREE.Vector3[]
  ) {
    this.faces.forEach(face => {
      (face as any).surface = this;
    });
    this.resetOriginalVertices = this.resetOriginalVertices.bind(this);
    this.addVector = this.addVector.bind(this);

    this.resetOriginalVertices();
  }

  resetOriginalVertices() {
    this.originalVertices = this.vertices.map(v => v.clone());
  }

  addVector(vector: THREE.Vector3) {
    this.vertices.forEach((vertex, index) => {
      // console.log(index, this.originalVertices[index]);
      vertex.copy(this.originalVertices[index].clone().add(vector));
    });

    this.hanger.geometry.verticesNeedUpdate = true;
    this.hanger.geometry.computeBoundingSphere();
    this.hanger.geometry.computeBoundingBox();
    this.hanger.geometry.computeFlatVertexNormals();
    this.hanger.geometry.mergeVertices();

    this.hanger.bbox.setFromObject(this.hanger.mesh);

    const width = this.hanger.bbox.max.x - this.hanger.bbox.min.x;
    // console.log(Math.round(width / GRID_SIZE_WIDTH));
    const height = this.hanger.bbox.max.y - this.hanger.bbox.min.y;
    // console.log(Math.round(height / GRID_SIZE_HEIGHT));
    const length = this.hanger.bbox.max.z - this.hanger.bbox.min.z;
    // console.log(Math.round(length / GRID_SIZE_LENGTH));
  }

  pushPull(distance: number) {
    // console.log(`pushpull ${distance}m`);
  }

  focus() {
    this.faces.forEach(face => {
      face.color.set(0x00ff00);
    });
  }

  blur() {
    // requestAnimationFrame(this.editor.animate);
    // console.log("out");
  }
}

export default Surface;
