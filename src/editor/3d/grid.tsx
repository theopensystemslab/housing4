import * as React from "react";
import * as THREE from "three";
import Thing from "./thing";

export default function Grid({ size }) {
  return (
    <Thing
      thing={(project, _scene) => {
        const o = new THREE.GridHelper(
          size * project.gridSize,
          size,
          new THREE.Color(0xdddddd),
          new THREE.Color(0xdddddd)
        );
        // o.position.x = project.gridSize / 2;
        return o;
      }}
    />
  );
}
