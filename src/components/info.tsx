import { inject, observer } from "mobx-react";
import * as React from "react";
import { compose } from "recompose";

const data = {
  global: [["Wall thickness", "wallThickness", "m", 0.3, 0.6, 0.02]],
  external: [
    // ["Wall height", "wallHeight", "m", 0.3, 0.6, 0.1],
    // ["Ridge height", "ridgeHeight", "m", 0.3, 0.6, 0.1],
    // ["Ridge offset", "ridgeHeight", "m", 0.3, 0.6, 0.1],

    ["Width", "width3d", "m", 3, 8, 1],
    ["Length", "length3d", "m", 1.2, 12, 1.2],
    // ["Height", "height3d", "m", 1.2, 4.8, 1.2],
    ["Footprint", "floorArea", "m2"],
    ["Roofing area", "roofingArea", "m2"],
    ["Cladding area", "claddingArea", "m2"]
  ],
  internal: [
    ["Width", "internalWidth", "m"],
    ["Length", "internalLength", "m"],
    ["Wall area", "internalWallArea", "m2"],
    ["Flooring area", "internalFlooringArea", "m2"],
    ["Insulation volume", "insulationVolume", "m3"]
  ]
};

const Info = compose(
  inject("project"),
  observer
)(({ project }) => {
  const p = project.toJSON();
  return (
    <table id="info">
      <tbody>
        {/* {Object.keys(p).map(key => (
          <tr key={key}>
            <th>{key}</th>
            <td>{JSON.stringify(p[key])}</td>
          </tr>
        ))} */}
        {Object.keys(data).map(key => (
          <React.Fragment key={key}>
            <tr>
              <th colSpan={2} className="category">
                {key}
              </th>
            </tr>

            {data[key].map(d => (
              <tr key={d[1]}>
                <th>
                  {d[0]} <span className="unit">{d[2]}</span>
                </th>
                <td>{project.hanger[d[1]].toFixed(2)}</td>
                {d[3] && (
                  <td>
                    <input
                      type="range"
                      min={d[3]}
                      max={d[4]}
                      step={d[5]}
                      value={project.hanger[d[6] ? d[6] : d[1]]}
                      onChange={e =>
                        project.hanger.adjust(d[1], Number(e.target.value))
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </React.Fragment>
        ))}
        <tr>
          <td colSpan={2}>
            <button>Open in engine →</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
});

export default Info;
