import React from 'react';

function LinkImg(props) {
  const { src } = props;
  return <a href={src} target="_blank"><img {...props}/></a>
}

export default LinkImg;
