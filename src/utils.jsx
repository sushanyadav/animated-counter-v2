import { useCallback, useEffect, useRef, useState } from 'react';

function intlFormat(num) {
  return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
}

export function isNumeric(str) {
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export function makeFriendly(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return intlFormat(num / 1000) + 'k';
  return intlFormat(num);
}

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
