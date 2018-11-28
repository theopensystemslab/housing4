import { inject, observer } from "mobx-react";
import * as React from "react";
import { compose } from "recompose";
import { Scene } from "three";

class Thing extends React.Component<{
  scene: Scene;
  project: any;
  thing: any;
}> {
  private thing;

  constructor(props) {
    super(props);
    // console.log("NEW OBJECT");
    this.thing = props.thing(this.props.project, this.props.scene);
  }

  componentDidMount() {
    this.props.scene.add(this.thing);
  }

  componentWillUnmount() {
    this.props.scene.remove(this.thing);
  }

  render() {
    return null;
  }
}

export default compose<{ thing: any }>(
  inject("project", "scene"),
  observer
)(Thing);
