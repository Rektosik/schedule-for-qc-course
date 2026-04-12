import {getShortTitle} from './shortTitle';

describe('getShortTitle function', () => {
    it('should return short title with 2 symbols', () => {
        const title = '23(203)';
        expect(getShortTitle(title, 2)).toEqual('23...');
    });
    it('should return short title with 6 symbols', () => {
        const title = '27(207)';
        expect(getShortTitle(title, 6)).toEqual('27(207...');
    });
    it('should handle title length equal to MAX_LENGTH', () => {
        const title = 'Testing';
        expect(getShortTitle(title, 7)).toBe('Testing');
    });
    it('should return empty string if title is empty', () => {
        expect(getShortTitle('', 10)).toBe('');
    });
    it('should handle MAX_LENGTH equal to 0', () => {
        expect(getShortTitle('Some Title', 0)).toBe('...');
    });
    it('should truncate string if length is greater than MAX_LENGTH', () => {
        expect(getShortTitle('Long Title', 4)).toBe('Long...');
    });
});
