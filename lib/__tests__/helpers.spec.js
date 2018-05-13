const {getJWT} = require('../helpers');


test('getJWT Extract Tocken From Header', () => {
    expect(getJWT('bearer fas;flgl;wq;ldal;fasfl;gjarjwfla;sfjg;las')).toBe('fas;flgl;wq;ldal;fasfl;gjarjwfla;sfjg;las');
});

test('getJWT return null when header is `null`', () => {
    expect(getJWT('null')).toBe(null);
});


test('getJWT return null when header is null', () => {
    expect(getJWT(null)).toBe(null);
});

test('getJWT return null when header is wrong format', () => {
    expect(getJWT('qweqweqwewqeqwe')).toBe(null);
});

test('getJWT return null when token doesn\'t exist', () => {
    expect(getJWT('bearer')).toBe(null);
});
