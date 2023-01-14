import React from 'react'
import "./styles.css";
const RightContainer = ({data,ppltn}) => {


  let veri = data

  return (
    <div className="rightContainer">
        <div>
            <div className='baslik'>{data}</div>

            <hr></hr>
              Veri : {veri}
            <br />

            <hr></hr>
              Population : {ppltn}
            <br />
            
        </div>
  </div>

  
  )
}

export default RightContainer