import { useSpring, useAnimate, useTransform, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { isNumeric, makeFriendly } from './utils';

// TO PREVENT BLUR ANIMATION ON WINDOW LOAD
let initalAnimate = false;

const Number = ({ mv, height, number, debug }) => {
  let y = useTransform(mv, (latest) => {
    const b = latest % 10;

    if (debug) console.log(b, 'b', number, 'number');

    const offset = (10 + number - b) % 10;
    let memo = offset * height;

    if (offset > 5) memo = memo - 10 * height;

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className={`absolute number inset-0 flex items-center justify-center`}
    >
      {number}
    </motion.span>
  );
};

const Digit = ({ height, debug, valueRoundedToPlace }) => {
  const [scope, animate] = useAnimate();

  let animatedValue = useSpring(valueRoundedToPlace, {
    bounce: 0,
  });

  useEffect(() => {
    if (!initalAnimate) {
      setTimeout(() => (initalAnimate = true), 0);
      return;
    }

    animate(
      '.number',
      {
        filter: ['blur(4.5px)', 'blur(0px)'],
        scale: [0.6, 1],
      },
      {
        duration: 0.6,
      }
    );

    // find a way to remove inital animation on window load
  }, [animate, valueRoundedToPlace]);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div
      ref={scope}
      style={{ height }}
      className="relative w-[1ch] tabular-nums"
    >
      {Array.from({ length: 10 }, (_, i) => i).map((i) => (
        <Number
          debug={debug}
          height={height}
          key={i}
          mv={animatedValue}
          number={i}
        />
      ))}
    </div>
  );
};

export const AnimatedCounter = ({
  isFormatted = true, // remove true to see how it looks like when number is not formatted
  number,
  fontSize = 16,
  padding = 12,
}) => {
  const height = fontSize + padding;

  const numArray = isFormatted
    ? number < 9999
      ? new Intl.NumberFormat().format(number).split('')
      : makeFriendly(number).split('')
    : number.toString().split('');

  return (
    <motion.span
      layout="position"
      transition={{
        layout: {
          type: 'spring',
          damping: 20,
          stiffness: 200,
        },
      }}
      style={{
        fontSize: `${fontSize}px`,
        height: `${height + padding}px`,
        overflow: 'hidden',
        WebkitMaskImage: `linear-gradient(to bottom, transparent, black 30%, black calc(100% - 30%), transparent)`,
        maskImage: `linear-gradient(to bottom, transparent, black 30%, black calc(100% - 30%), transparent)`,
      }}
      className="flex w-fit mx-auto items-center justify-center leading-text-white"
    >
      {numArray.map((_digit, index) => {
        // check if the digit is not a number
        if (!isNumeric(_digit)) {
          return <span key={index}>{_digit}</span>;
        }

        const digit = +_digit;

        const place = isFormatted
          ? 1
          : Math.pow(10, numArray.length - index - 1);

        const valueRoundedToPlace = isFormatted
          ? digit
          : Math.floor(number / place);

        return (
          <Digit
            key={index}
            debug={index === numArray.length - 1} // just for console logs (logging last column)
            height={height}
            valueRoundedToPlace={valueRoundedToPlace}
          />
        );
      })}
    </motion.span>
  );
};
