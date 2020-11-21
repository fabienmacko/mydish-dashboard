import React from 'react';
import LoaderSVG from '../../loader.svg';

class Loader extends React.Component {

  componentDidMount() {
    
    setTimeout(() => {
      this.loaderImage.classList.add("aos-animate");
    }, 0);
  }

  componentWillUnmount() {
    console.log("loader unmount");
  }

  render() {
    return (
        <div data-aos="fade-in" className="loader" style={{
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
          <img ref={image => this.loaderImage = image} src={LoaderSVG} alt="Loader" data-aos="zoom-in" />
        </div>
    )
  }
}

export default Loader;