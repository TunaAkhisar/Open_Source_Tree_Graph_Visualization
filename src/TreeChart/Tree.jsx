import React from "react";
import Tree from "react-d3-tree";
import "./styles.css";
import { useState, useEffect, useCallback } from "react";
import { useCenteredTree } from "./helpers";
import LazyLoad from "react-lazy-load";
import axios from "axios";
import ClassificationData from "./response-classification.json"

const RightContainer = React.lazy(() => import("./RightContainer"));

export default function Treee() {

  // IFM Classification State Management
  const [ifmData, setIfmData] = useState({});


  // Getting Data From Swagger End-Point

  useEffect(() => {
    const axiosData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3010/classification"
        );
        setIfmData(response.data.root);
      } catch (err) {
        console.log(err);
        alert("Wrong End Point !!!!\n" + err)
      }
    };
    axiosData();
  }, []);


  console.log(ifmData);

  // Container Canvas For Tree Graph
  const containerStyles = {
    width: "70%",
    height: "100vh",
  };

  // State Management For Names
  let [dataName, setDataName] = useState();

  // Data transfer to Right Container with node click
  const click = (data) => {
    let dataNode = JSON.parse(data);
    setDataName(dataNode.name);
  };

  // Conetext Menu Events
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("click", (e) => e.preventDefault());

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const [nameState, setNameState] = useState();

  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const handleContextMenuu = useCallback(
    (event, nodeDatum) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShow(true);
      setNameState(nodeDatum.name);
    },
    [setAnchorPoint]
  );

  const handleClick = useCallback(() => (show ? setShow(false) : null), [show]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  // Customizing Node and Node Events
  let renderNodeWithCustomEvents = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    //
    <g
      onClick={() => {
        toggleNode(); // To Close And Opening Node
        click(JSON.stringify(nodeDatum)); // To Transferin Node's Data
      }}
      onContextMenu={(event) => {
        handleContextMenuu(event, nodeDatum); // Context Events
      }}
    >
      <defs>
        {/* Drawing Node View And Adding İmage if Have */}
        <pattern
          id={nodeDatum.attributes?.image}
          height="100%"
          width="100%"
          viewBox="0 0 32 32"
        >
          <image
            xlinkHref={`${nodeDatum.attributes?.image}`}
            image={`${nodeDatum.attributes?.image}`}
            width="32"
            heght="32"
          />
        </pattern>
      </defs>

      {/* Drawing Circle */}
      <circle r="20"></circle>

      {/* Drawing Circle Adding Attribute image*/}
      {/* <circle r="20" fill={`url(#${nodeDatum.attributes?.image})`} ></circle> */}

      {/* Adding Node Name To The Bottom Of The Node*/}
      <foreignObject
        {...foreignObjectProps}
        style={{
          overflow: "visible",
          x: -40,
          y: -15,
        }}
      >
        <div>
          <div
            style={{
              marginLeft: "20px",
              marginTop: "35px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {nodeDatum.name}
          </div>
        </div>
      </foreignObject>

            {/* Counting nodes with sub-breaks */ }
      <foreignObject
          style={{
            overflow: "visible",
            x: 15,
            y: -35,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {nodeDatum.children?.length > 0 ? "+" : null}
            {nodeDatum.children?.length || null}
          </div>
        </foreignObject>


    </g>
  );


  // Centering Tree Events
  const [dimensions, translate, containerRef] = useCenteredTree();

  // State Management For Position & Links
  const [changePos, setChangePos] = useState("vertical");
  const [pathFunc, setPathFunc] = useState("diagonal");

  // This function Changing Position
  const changePosition = () => {
    var newPos = "";

    if (changePos === "vertical") {
      newPos = "horizontal";
    } else {
      newPos = "vertical";
    }

    setChangePos(newPos);
  };

  // This function Changing Links
  const changePathFunc = () => {
    var newPathFunc = "";

    if (pathFunc === "diagonal") {
      newPathFunc = "step";
    } else {
      newPathFunc = "diagonal";
    }

    setPathFunc(newPathFunc);
  };

  const nodeSize = { x: 75, y: 80 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y };



  // Rendering
  return (
    <div className="color">
      <div className="bttn">
        <>
          <b>Tree Graph </b>
        </>
        <button onClick={changePosition} className="btt">
          {changePos}
        </button>
        <button onClick={changePathFunc} className="btt">
          {pathFunc}
        </button>
      </div>

      {/* Right Container To Show Name and Othe Attributes of Datas*/}
      <div>
        <RightContainer data={dataName} />
      </div>
      {/* Wrapping with Lazy Load for performance optimization */}
      <LazyLoad>
        <div style={containerStyles} ref={containerRef}>
          {/* Tree Component from React-D3-Tree to Drawing Tree Graph and Other Attributes */}
          <Tree
            data={ClassificationData.root}
            dimensions={dimensions}
            translate={translate}
            renderCustomNodeElement={(props) =>
              renderNodeWithCustomEvents({ ...props, foreignObjectProps })
            }
            orientation={`${changePos}`}
            collapsible={true}
            zoomable={true}
            zoom={1}
            pathFunc={`${pathFunc}`}
            initialDepth={"1"}
            depthFactor={"100"}
            separation={{ nonSiblings: 0.5, siblings: 0.6 }}
            scaleExtent={{ min: 0.1, max: 10 }}
            shouldCollapseNeighborNodes={true}
            enableLegacyTransitions={true}
            transitionDuration={100}
            useCollapseData = {true}
            
          />
        </div>
      </LazyLoad>

      {/* With The Right Click Context Menu Open And This Shows Up*/}
      <div>
        {show ? (
          <ul
            className="menu"
            style={{
              top: anchorPoint.y,
              left: anchorPoint.x,
            }}
          >
            <button onClick={changePosition} className="butonContext">
              Change Position
            </button>
            <button onClick={changePathFunc} className="butonContext">
              Change Link
            </button>
          </ul>
        ) : (
          <> </>
        )}
      </div>
    </div>
  );
}
