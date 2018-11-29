import { inject, observer } from "mobx-react";
import * as React from "react";
import { compose } from "recompose";
import { animationFrameScheduler, fromEvent, merge } from "rxjs";
import {
  filter,
  map,
  mergeAll,
  scan,
  share,
  takeUntil,
  tap,
  throttleTime,
  withLatestFrom
} from "rxjs/operators";
import * as THREE from "three";
import Controls from "./3d/controls";
import DebugPlane from "./3d/debug_plane";
import Grid from "./3d/grid";
import Hanger from "./3d/hanger";

class Editor extends React.Component<{ project; scene: THREE.Scene }> {
  private camera;
  private container: HTMLDivElement;
  private debugPlane;
  // private hanger;
  private intersection;
  private normal;
  private orbitControls: THREE.OrbitControls;
  private plane = new THREE.Plane();
  private planeIntersection = new THREE.Vector3();
  private raycaster = new THREE.Raycaster();
  private renderer = new THREE.WebGLRenderer({ antialias: true });
  private height = 500;
  private width = 500;

  componentDidMount() {
    const { domElement } = this.renderer;

    this.renderer.setClearColor(0xeeeeee);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(-8, 12, 8);
    this.camera.lookAt(0, 0, 0);

    this.container.appendChild(domElement);

    this.orbitControls = Controls(this.camera, domElement);

    this.debugPlane = DebugPlane(false);
    this.props.scene.add(this.debugPlane);

    const throttleToAnimationFrame = throttleTime(0, animationFrameScheduler);

    const mouseMove$ = fromEvent(document, "mousemove").pipe(
      throttleToAnimationFrame,
      share()
    );
    domElement.dispatchEvent(new Event("mousemove"));

    const wheel$ = fromEvent(domElement, "wheel").pipe(
      throttleToAnimationFrame
    );

    const mouseDown$ = fromEvent(domElement, "mousedown");
    const mouseUp$ = fromEvent(document, "mouseup").pipe(share());
    const click$ = fromEvent(domElement, "click");

    mouseUp$.subscribe(() => {
      this.orbitControls.enabled = true;
      // this.hanger.surfaces.forEach(s => s.resetOriginalVertices());
    });

    merge(mouseMove$, wheel$).subscribe(() => {
      requestAnimationFrame(this.animate);
    });

    const xy$ = mouseMove$.pipe(
      scan(
        (acc, event: MouseEvent): any => {
          acc.x = (event.layerX / this.width) * 2 - 1;
          acc.y = (event.layerY / this.height) * -2 + 1;
          return acc;
        },
        { x: 0, y: 0 }
      )
    );

    const intersection$ = xy$.pipe(
      map(xy => {
        this.raycaster.setFromCamera(xy, this.camera);
        return [];
        // return this.raycaster.intersectObject(this.hanger.mesh);
      }),
      share()
    );
    intersection$.subscribe(intersections => {
      if (intersections.length > 0) {
        // this.hanger.handleMouseOver(intersections[0]);
      } else {
        // this.hanger.handleMouseOut();
      }
    });

    const surfaceClick$ = click$.pipe(
      withLatestFrom(intersection$),
      filter(([_mouseEvent, intersections]) => intersections.length > 0),
      // map(() => mouseMove$.pipe(takeUntil(mouseUp$))),
      mergeAll()
    );
    surfaceClick$.subscribe(() => {});

    const surfaceDrag$ = mouseDown$.pipe(
      withLatestFrom(intersection$),
      filter(([_mouseEvent, intersections]) => intersections.length > 0),
      tap(([_mouseEvent, intersections]) => {
        this.orbitControls.enabled = false;

        this.intersection = intersections[0];

        this.normal = this.intersection.face.normal.clone().normalize();
        if (this.normal.x + this.normal.y + this.normal.z < 0) {
          this.normal.negate();
        }

        this.debugPlane.position.copy(this.intersection.point);
        this.debugPlane.lookAt(
          this.intersection.point.clone().add(this.intersection.face.normal)
        );
        const [a, b, c] = this.debugPlane.userData.pts();
        this.plane.setFromCoplanarPoints(a, b, c);
      }),
      map(() =>
        mouseMove$.pipe(
          tap(() => {
            this.raycaster.ray.intersectPlane(
              this.plane,
              this.planeIntersection
            );

            const toAdd = new THREE.Vector3().multiplyVectors(
              this.normal,
              this.planeIntersection.clone().sub(this.intersection.point)
            );

            const {
              gridSizeWidth,
              gridSizeHeight,
              gridSizeLength
            } = this.props.project;

            toAdd.x = Math.round(toAdd.x / gridSizeWidth) * gridSizeWidth;
            toAdd.y = Math.round(toAdd.y / gridSizeHeight) * gridSizeHeight;
            toAdd.z = Math.round(toAdd.z / gridSizeLength) * gridSizeLength;

            this.intersection.face.surface.addVector(toAdd);
            // if (this.normal.z === 1 || this.normal.z === -1) {
            //   toAdd.z = Math.round(toAdd.z / 1.2) * 1.2;
            // }
            // console.log(toAdd);
          }),
          takeUntil(mouseUp$)
        )
      ),

      mergeAll()
    );
    surfaceDrag$.subscribe(() => {});

    this.handleResize();
  }

  animate = () => {
    this.renderer.render(this.props.scene, this.camera);
  };

  handleResize = (event = null) => {
    const { clientWidth, clientHeight } = this.container;
    this.renderer.setSize(clientWidth, clientHeight);
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <div
        ref={el => (this.container = el)}
        style={{ width: "100%", height: "100vh" }}
      >
        <Grid size={100} />
        <Hanger />
      </div>
    );
  }
}

export default compose(
  inject("project", "scene"),
  observer
)(Editor);
