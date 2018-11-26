import { inject, observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { compose } from "recompose";
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

class Editor extends React.Component {
  private camera;
  private container: HTMLDivElement;
  // private objectsToRaycast: THREE.Object3D[];
  // private orbitControls: THREE.OrbitControls;
  // private raycaster = new THREE.Raycaster();
  private renderer = new THREE.WebGLRenderer({ antialias: true });
  private scene = new THREE.Scene();

  componentDidMount() {
    this.renderer.setClearColor(0xeeeeee);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(-30, 100, 70);
    this.camera.lookAt(0, 0, 0);

    this.container.appendChild(this.renderer.domElement);

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
