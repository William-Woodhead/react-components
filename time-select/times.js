import map from 'lodash/map';
import range from 'lodash/range';
import padStart from 'lodash/padStart';

export const times = map(range(24 * 12), (index) => {
  const hour = Math.floor(index / 12);
  const minute = (index % 12) * 5;
  const id = `${padStart(hour, 2, '0')}:${padStart(minute, 2, '0')}`;

  return {
    label: id,
    id
  };
});
