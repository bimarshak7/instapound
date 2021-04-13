import React from 'react';
import './common.css';
const Loading = () => {
    return (
        <div>
            <h2 className='loadtext'>Loading...</h2>
            <div className="lds-hourglass"></div>
        </div>
    )
}

export default Loading;