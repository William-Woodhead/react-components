import { getPhrasedAndUnselected } from '../index';
import expect from 'expect';

describe('Get phrased and unselected', () => {
  it('should not return the options which are selected', () => {
    const options = [{
      id: 'id_1',
      label: 'label_1',
      selected: false
    }, {
      id: 'id_2',
      label: 'label_2',
      selected: true
    }];

    const phrase = '';

    expect(getPhrasedAndUnselected(options, phrase)).toEqual([{
      id: 'id_1',
      label: 'label_1',
      selected: false
    }]);
  });

  it('should return an empty array if there are no options', () => {
    const options = [{
      id: 'id_1',
      label: 'label_1',
      selected: true
    }, {
      id: 'id_2',
      label: 'label_2',
      selected: true
    }];

    const phrase = '';

    expect(getPhrasedAndUnselected(options, phrase)).toEqual([]);
  });

  it('should return options that have the string that is contained in the phrase', () => {
    const options = [{
      id: 'id_1',
      label: 'label_1',
      selected: false
    }, {
      id: 'id_2',
      label: 'label_2',
      selected: false
    }, {
      id: 'id_3',
      label: 'anotherlabel_2',
      selected: false
    }, {
      id: 'id_4',
      label: 'anothernuvalabel_2',
      selected: true
    }];

    const phrase = '_2';

    expect(getPhrasedAndUnselected(options, phrase)).toEqual([{
      id: 'id_2',
      label: 'label_2',
      selected: false
    }, {
      id: 'id_3',
      label: 'anotherlabel_2',
      selected: false
    }]);
  });
});
