import { useSpring, useAnimate, useTransform, motion } from "framer-motion";
import { useEffect } from "react";
import { isNumeric, makeFriendly, usePrevious } from "./utils";

// TO PREVENT BLUR ANIMATION ON WINDOW LOAD
let initalAnimate = false;

const Number = ({ mv, height, number }) => {
  let y = useTransform(mv, (latest) => {
    const b = latest % 10;

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

const Digit = ({
  height,
  isIncreasing,
  isDecreasing,
  debug,
  isFormatted,
  valueRoundedToPlace,
  isNegative,
}) => {
  const [scope, animate] = useAnimate();

  let animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 200,
    damping: 30,
  });

  useEffect(() => {
    if (!initalAnimate) {
      setTimeout(() => (initalAnimate = true), 0);
      return;
    }

    animate(
      ".number",
      {
        filter: ["blur(4.5px)", "blur(0px)"],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedValue, valueRoundedToPlace]);

  useEffect(() => {
    if (!isFormatted) return;
    const _prev = animatedValue.getPrevious();
    const prev = Math.round(_prev);
    const diff = valueRoundedToPlace - prev;

    if (isNegative) {
      if (diff < 0 && isDecreasing) {
        animatedValue.jump(0 - 1);
      }

      if (diff > 0 && isIncreasing) {
        animatedValue.jump(9 + 1);
      }
    } else {
      if (diff < 0 && isIncreasing) {
        animatedValue.jump(0 - 1);
      }

      if (diff > 0 && isDecreasing) {
        animatedValue.jump(9 + 1);
      }
    }
  }, [
    animatedValue,
    debug,
    isFormatted,
    isDecreasing,
    isIncreasing,
    isNegative,
    valueRoundedToPlace,
  ]);

  return (
    <div
      ref={scope}
      style={{ height }}
      className="relative w-[1ch] tabular-nums"
    >
      {Array.from({ length: 10 }, (_, i) => i).map((i) => (
        <Number height={height} key={i} mv={animatedValue} number={i} />
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
  const prevNum = usePrevious(number);

  const height = fontSize + padding;

  const isNegative = number < 0;

  const positiveNumber = isNegative ? number * -1 : number;

  const numArray = isFormatted
    ? positiveNumber < 9999
      ? new Intl.NumberFormat().format(number).split("")
      : isNegative
      ? ["-", ...makeFriendly(positiveNumber).split("")]
      : makeFriendly(positiveNumber).split("")
    : number.toString().split("");

  const isIncreasing = prevNum ? prevNum < number : false;
  const isDecreasing = prevNum ? prevNum > number : false;

  return (
    <motion.span
      layout="position"
      transition={{
        layout: {
          type: "spring",
          damping: 20,
          stiffness: 200,
        },
      }}
      style={{
        fontSize: `${fontSize}px`,
        height: `${height + padding}px`,
        overflow: "hidden",
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
            isFormatted={isFormatted}
            isIncreasing={isIncreasing}
            isNegative={isNegative}
            isDecreasing={isDecreasing}
            debug={index === numArray.length - 1} // just for console logs (logging last column)
            height={height}
            valueRoundedToPlace={valueRoundedToPlace}
          />
        );
      })}
    </motion.span>
  );
};
