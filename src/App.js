import React, { Suspense} from "react";
import "./TreeChart/styles.css"

const TreeChartData = React.lazy(() => import ('./TreeChart/Tree'))


export default function App() {
  return (
    <div className="App">
      <Suspense fallback= {<div>Loading</div>}>
        <TreeChartData />
      </Suspense>
    </div>
  );
}

