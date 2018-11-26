import { inject, observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { compose } from "recompose";
import { fromEvent } from "rxjs";
import { scan } from "rxjs/operators";
import * as THREE from "three";
import Project from "./stores/project";

const project = Project.create({
  id: "1",
  name: "Pionierswoning WHAlm",
  description: "Tiny House",
  defaultCurrency: "EUR"
  // location: Location.create({
  //   countryCode: "NL",
  //   region: "Flevoland",
  //   address: "Alseidenstraat 6",
  //   postcode: "B-1047"
  // }),
  // building: Building.create({
  //   numStoreys: 2,
  //   numBedrooms: 2,
  //   numOccupants: 2,
  //   frameWidth: 18,
  //   external: {
  //     width: 300,
  //     length: 300
  //   }
  // })
});

const Info = compose(
  inject("project"),
  observer
)(({ project }) => {
  const p = project.toJSON();
  return (
    <table>
      <tbody>
        {Object.keys(p).map(key => (
          <tr key={key}>
            <th>{key}</th>
            <td>{p[key]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

class Hanger {
  mesh: THREE.Mesh;
  geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshNormalMaterial({ opacity: 0.5, transparent: true });

  constructor(private editor) {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  handleMouseOver(intersection) {
    this.material.opacity = 1;
    requestAnimationFrame(this.editor.animate);
    console.log(intersection);
  }
  handleMouseOut() {
    this.material.opacity = 0.5;
    requestAnimationFrame(this.editor.animate);
    console.log("out");
  }
}

class Editor extends React.Component {
  private camera;
  private container: HTMLDivElement;
  // private orbitControls: THREE.OrbitControls;
  // private objectsToRaycast: THREE.Object3D[];
  private raycaster = new THREE.Raycaster();
  private renderer = new THREE.WebGLRenderer({ antialias: true });
  private scene = new THREE.Scene();
  private hanger;
  private intersections = [];

  componentDidMount() {
    this.hanger = new Hanger(this);

    this.renderer.setClearColor(0xeeeeee);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(-3, 7, 5);
    this.camera.lookAt(0, 0, 0);

    this.container.appendChild(this.renderer.domElement);

    this.scene.add(this.hanger.mesh);

    const mouseMove$ = fromEvent(this.renderer.domElement, "mousemove");

    mouseMove$
      .pipe(
        scan(
          (acc, event: MouseEvent): any => {
            acc.x = (event.layerX / 500) * 2 - 1;
            acc.y = (event.layerY / 500) * 2 - 1;
            return acc;
          },
          { x: 0, y: 0 }
        )
      )
      .subscribe(xy => {
        this.raycaster.setFromCamera(xy, this.camera);
        this.intersections = this.raycaster.intersectObject(this.hanger.mesh);
        if (this.intersections.length > 0) {
          this.hanger.handleMouseOver(this.intersections[0]);
        } else {
          this.hanger.handleMouseOut();
        }
      });

    this.handleResize();
  }

  animate = () => {
    this.renderer.render(this.scene, this.camera);
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
        style={{ width: 500, height: 500 }}
      />
    );
  }
}

function App() {
  return (
    <Provider project={project}>
      <React.Fragment>
        <Info />
        <Editor />
      </React.Fragment>
    </Provider>
  );
}

render(<App />, document.getElementById("app"));
