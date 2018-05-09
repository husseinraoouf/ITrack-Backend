const { generatePasswordHash, checkPassword, encodeJWT, decodeJWT } = require('../hash');


test('generate password and check works', async () => {
    const password = "123456as";
    const hash = await generatePasswordHash(password);
    const result = await checkPassword(password, hash);
    expect(result).toBeTruthy();
});


test('encode and decode a JWT works', () => {
    const data = {id: 1, data: 5};
    const token = encodeJWT(data);
    const result = decodeJWT(token);
    expect(result).toEqual({ ...data, iat: Math.floor(Date.now()/1000)});
})