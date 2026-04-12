import {firstStringLetterCapital} from './strings';

describe('firstStringLetterCapital function', () => {
    it('should return word with capitalize letter', () => {
        const str = 'hello';
        expect(firstStringLetterCapital(str)).toEqual('Hello');
    });
    it('should return first  word with capitalize letter', () => {
        const str = 'hello world';
        expect(firstStringLetterCapital(str)).toEqual('Hello world');
    });
    it('should handle empty string', () => {
        expect(firstStringLetterCapital('')).toBe('');
    });
    it('should handle string that already starts with capital letter', () => {
        expect(firstStringLetterCapital('Hello')).toBe('Hello');
    });
    it('should handle string starting with a number', () => {
        expect(firstStringLetterCapital('1test')).toBe('1test');
    });
    it('should capitalize first letter of lowercase string', () => {
        expect(firstStringLetterCapital('world')).toBe('World');
    });
});
