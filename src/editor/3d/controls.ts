import { OrbitControls } from "three";
import "three-orbit-controls";

export default function Controls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.dampingFactor = 0.25;
  controls.enableDamping = true;
  controls.enableKeys = false;
  controls.enableZoom = true;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI / 2 - 0.15;
  controls.minDistance = 10;
  controls.minPolarAngle = 0.1;
  (controls as any).panSpeed = 0.2;
  controls.rotateSpeed = 0.4;
  return controls;
}
