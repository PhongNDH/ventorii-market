export const formatWallet = (address: any) => {
  if (!address) return '';
  return `${address?.slice(0, 5)}...${address?.slice(-4)}`;
};

export const handleCopy = async (text: string, setCopied: any) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

export const formatToken = (value: BigInt, decimals: number = 18) => {
  const formattedValue = Number(value) / Math.pow(10, decimals);
  if (Number.isInteger(formattedValue)) {
    return formattedValue.toString();
  } else {
    return parseFloat(formattedValue.toFixed(10)).toString();
  }
};
