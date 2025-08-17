import Lottie from 'lottie-react';
import dataLoaderAnimation from '../assets/Lottie/data_loader.json';

export default function DataLoader({
  size = 80,
  style = {},
  className = '',
  label = 'Loading...',
  labelClassName = ''
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      style={style}
      aria-label="Loading"
      role="status"
    >
      <div style={{ width: size, height: size }}>
        <Lottie animationData={dataLoaderAnimation} loop autoplay />
      </div>
      <span
        className={`mt-2 text-gray-600 dark:text-gray-300 text-sm ${labelClassName}`}
      >
        {label}
      </span>
    </div>
  );
}