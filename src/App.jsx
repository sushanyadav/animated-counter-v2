import "./App.css";

import { useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

function App() {
  const [count, setCount] = useState(4291);
  const [isFormatted, setFormatted] = useState(true);

  return (
    <>
      <div className="grid place-items-center text-white min-h-screen">
        <div>
          <div className="pb-[200px]">
            <AnimatedCounter
              isFormatted={isFormatted}
              number={count}
              fontSize={72}
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 inset-x-0 text-white py-6 flex flex-col items-center justify-center gap-5 bg-[#0f0f0f] border-gray-900 border-t">
        <div className="flex gap-10 items-center">
          <label
            htmlFor="input-num"
            className="flex flex-col items-center gap-4 text-xs"
          >
            Type any number or use scroll wheel to increase / decrease
            <input
              type="number"
              id="input-num"
              className="bg-[#0a0a0a] rounded-md h-10 px-5 text-base focus:ring focus:ring-gray-500/20 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={count}
              onKeyDown={(evt) => {
                const isNumber = /[0-9]/.test(evt.key);
                const isMetaKey = evt.metaKey || evt.ctrlKey;
                const backSpace = evt.key === "Backspace";
                const isArrowKey = evt.key.includes("Arrow");

                if (!isNumber && !isMetaKey && !isArrowKey && !backSpace) {
                  evt.preventDefault();
                }
              }}
              onChange={(e) => setCount(e.target.value)}
            />
          </label>
        </div>
        <div className="flex gap-10 items-center">
          <label htmlFor="format" className="flex items-center gap-2">
            <input
              type="checkbox"
              id="format"
              checked={isFormatted}
              onChange={(e) => setFormatted(e.target.checked)}
            />
            Format
          </label>
        </div>
        <div className="flex gap-10 items-center">
          <button
            onClick={() => setCount((prev) => Number(prev) + 1)}
            className="mr-2 border-b border-gray-300"
          >
            Increase + 1
          </button>
          <button
            className="border-b border-gray-300"
            onClick={() => setCount((prev) => Number(prev) - 1)}
          >
            Decrease + 1
          </button>
        </div>
        <div className="flex gap-10 items-center">
          <button
            onClick={() => setCount((prev) => Number(prev) + 124)}
            className="mr-2 border-b border-gray-300"
          >
            Increase 124
          </button>
          <button
            className="border-b border-gray-300"
            onClick={() => setCount((prev) => Number(prev) - 321)}
          >
            Decrease 321
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
