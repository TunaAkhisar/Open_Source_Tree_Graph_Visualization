import React from 'react'
import "./styles.css";
const RightContainer = ({data}) => {


  let veri = data

  return (
    <div className="rightContainer">
        <div>
            <div className='baslik'>{data}</div>

            <hr></hr>
              Veri : {veri}
            <br />
            
        </div>
  </div>

  
  )
}

export default RightContainer