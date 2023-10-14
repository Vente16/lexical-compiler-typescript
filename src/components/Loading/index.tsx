import { useState, useEffect } from 'react';

const LoadingPercentage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress((prevProgress) => {
          if (prevProgress === 0) return 30;
          else if (prevProgress === 30) return 60;
          else if (prevProgress === 60) return 80;
          else if (prevProgress === 80) return 100;
          else return prevProgress + 10;
        });
      } else {
        clearInterval(interval);
      }
    }, 500); // 750 milliseconds for each step (0% to 30%, 30% to 60%, etc.)

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="top-0 left-0 w-full flex justify-center items-center">
      <div className="relative w-2/3 h-1/4 bg-gray-300 rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}></div>
        <p className="text-center text-black-500 mt-2">{progress}%</p>
      </div>
    </div>
  );
};

export default LoadingPercentage;
