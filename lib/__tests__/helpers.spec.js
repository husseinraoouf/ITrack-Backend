const { getJWT } = require('../helpers');


test('adds 1 + 2 to equal 3', () => {
    expect(getJWT("bearer fas;flgl;wq;ldal;fasfl;gjarjwfla;sfjg;las")).toBe("fas;flgl;wq;ldal;fasfl;gjarjwfla;sfjg;las");
});
