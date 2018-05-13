const {generatePasswordHash, checkPassword, encodeJWT, decodeJWT} = require('../hash');


test('generatePasswordHash Works Correctly', async () => {
    const password = '123456as';
    const hash = await generatePasswordHash(password);
    expect(hash).toMatch(/^\$2a\$10.*$/);
    expect(hash).toHaveLength(60);
});


test('checkPassword Works when the hash is correct', async () => {
    const password = '123456as';
    const hash = await generatePasswordHash(password);
    const result = await checkPassword(password, hash);
    expect(result).toBeTruthy();
});


test('checkPassword Works when the hash is wrong', async () => {
    const result = await checkPassword('123456as', 'qweuqwoieuwoeqwe');
    expect(result).toBeFalsy();
});

test('checkPassword Works when the hash in null', async () => {
    const result = checkPassword('123456as', null);
    expect(result).rejects.toThrow('Illegal arguments');
});

test('checkPassword Works when the password in null', async () => {
    const result = checkPassword(null, 'qweuqwoieuwoeqwe');
    expect(result).rejects.toThrow('Illegal arguments');
});

test('encodeJWT Works Correctly', () => {
    const data = {id: 1, data: 5};
    const token = encodeJWT(data);
    expect(token).toMatch(/^.*\..*\..*$/);
    expect(token).toHaveLength(127);
});


test('decodeJWT Works when the token is correct', () => {
    const data = {id: 1, data: 5};
    const token = encodeJWT(data);
    const result = decodeJWT(token);
    expect(result).toMatchObject(data);
});


test('decodeJWT Works when the token format is wrong', () => {
    const temp = () => {
        decodeJWT('qwhdkajshdkjahdkajsd');
    };
    expect(temp).toThrowError('jwt malformed');
});

test('decodeJWT Works when the token is wrong', () => {
    const temp = () => {
        decodeJWT('qyshbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0YSI6NSwiaWF0IjoxNTI2MjQxNzk1fQ.8KSthzdS4P9cLUIAiG498s94ddi1Ie6fqj9Dboiuxe0');
    };
    expect(temp).toThrowError('invalid token');
});
