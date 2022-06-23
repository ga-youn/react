import React from "react";

// components views
import Component from './components/LandingPage';

function App() {

  return (
    //component는 부모요소가 감싸고 있어야함
    <>
      <Component /> 
    </>

  );
}

export default App;