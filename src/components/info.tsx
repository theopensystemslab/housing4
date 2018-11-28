import { inject, observer } from "mobx-react";
import * as React from "react";
import { compose } from "recompose";

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
            <td>{JSON.stringify(p[key])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default Info;
