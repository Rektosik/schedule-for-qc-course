import {sortByName} from './sortArray';

const array = [{ name: '1 к. 11 ауд.' }, { name: '1 к. 18 ауд.' }, { name: '1 к. 15 ауд.' }];
const expectedArray = [
    { name: '1 к. 11 ауд.' },
    { name: '1 к. 15 ауд.' },
    { name: '1 к. 18 ауд.' },
];

describe('sortByName function', () => {
    it('should return sorted array', () => {
        expect(sortByName(array)).toEqual(expectedArray);
    });
    it('should handle array with one element', () => {
        const arr = [{ name: 'Single' }];
        expect(sortByName(arr)).toEqual([{ name: 'Single' }]);
    });
    it('should handle array with identical names', () => {
        const arr = [{ name: 'Alpha' }, { name: 'Alpha' }];
        expect(sortByName(arr)).toEqual([{ name: 'Alpha' }, { name: 'Alpha' }]);
    });
    it('should handle empty array', () => {
        expect(sortByName([])).toEqual([]);
    });
    it('should sort elements in alphabetical order', () => {
        const arr = [{ name: 'B' }, { name: 'A' }, { name: 'C' }];
        expect(sortByName(arr)).toEqual([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    });
});
