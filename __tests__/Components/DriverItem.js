import 'react-native';
import React from 'react';
import DriverItem from '../../App/Components/DriverItem.js';

import renderer from 'react-test-renderer';

it('DriverItem renders correctly', () => {
  const rider = {
    'avatar': 'http://some.pic/gif'
  };

  const tree = renderer.create(
    <DriverItem driver={rider} />
  );

});
