import * as React from 'react';

import './style.scss';

interface IProperties {
  short: boolean;
}

const Logo = ({ short }: IProperties) => {
  return (
    <div className="sidebar-head">
      <h2>{short ? 'AD' : 'Auth Dashboard'}</h2>
    </div>
  );
};

export default Logo;
