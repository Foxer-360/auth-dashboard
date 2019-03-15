import { Avatar as AntdAvatar } from 'antd';
import * as React from 'react';

export interface IProperties {
  name: string;
  url?: string;
}

const getInitials = (name: string): string => {
  let res = '';

  name.split(' ').forEach((val: string) => {
    if (val.length < 1) {
      return;
    }

    res += val[0].toUpperCase();
  });

  return res;
};

const Avatar = ({ name, url }: IProperties) => {
  if (!url || url.length < 2) {
    return (
      <AntdAvatar
        className="user-avatar"
        size="small"
        shape="square"
      >
        {getInitials(name)}
      </AntdAvatar>
    );
  }

  return (
    <AntdAvatar
      className="user-avatar"
      size="small"
      shape="square"
      src={url}
    />
  );
};

export default Avatar;
