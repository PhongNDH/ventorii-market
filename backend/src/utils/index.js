export const getToken = (req) => {
  const token = req.headers.authorization.split(' ')[1];
  return token;
};

export const feltToStr = (felt) => {
  let hex = felt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  const text = Buffer.from(hex, 'hex').toString('utf8');
  return text;
};

// export const feltToInt = ({ low, high }) => {
//   return Number((BigInt(high) << 64n) + BigInt(low));
// };
