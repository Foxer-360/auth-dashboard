import * as React from 'react';

import './style.scss';

interface IProperties {
  count: number;
}

const Loading = ({ count }: IProperties) => {
  if (count < 3) { count = 3; }
  const mapper = new Array(count - 1).fill(0);

  // Same variables like in SASS
  const ellipsisSize = 24;
  const ellipsisSpace = 12;

  const lastLeft = ellipsisSpace * count + ellipsisSize * (count - 1);

  const calcLeft = (ith: number) => {
    return (ellipsisSpace * (ith + 1)) + (ellipsisSize * ith);
  };

  return (
    <div className="lds-wrapper">
      <div className="lds-ellipsis" style={{ width: `${ellipsisSize * count + ellipsisSpace * (count + 1)}px` }}>
        <div className="first" />
        {mapper.map((n: number, i: number) => (
          <div key={i} className="middle" style={{ left: `${calcLeft(i)}px` }} />
        ))}
        <div className="last" style={{ left: `${lastLeft}px` }} />
      </div>
      <br /><br />
      <h1>LOADING</h1>
    </div>
  )
};

export default Loading;
