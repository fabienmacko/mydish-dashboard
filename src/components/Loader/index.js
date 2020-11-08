import React from 'react';
import LoaderSVG from '../../loader.svg';

const Loader = ({shouldAppear}) => {
  return (
    shouldAppear && (
      <div className="loader" style={{
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        left: '0',
        backgroundColor: 'rgb(0 0 0 / 75%)',
        zIndex: '99'
      }}>
        <img src={LoaderSVG} alt="Loader" />
      </div>
    )
  )
}

export default Loader;