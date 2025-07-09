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
      <span className={`mt-2 text-gray-600 text-sm ${labelClassName}`}>{label}</span>
    </div>
  );
}
/**
 * DataLoader - A reusable loading indicator using Lottie animation.
 *
 * Usage:
 *   import DataLoader from '../ui/DataLoader';
 *   ...
 *   {isLoading && <DataLoader label="Loading data..." />}
 *
 * Props:
 *   - size (number): Width/height in px (default: 80)
 *   - style (object): Custom style object
 *   - className (string): Extra class names for the wrapper
 *   - label (string): Text label below the animation (default: "Loading...")
 *   - labelClassName (string): Extra class names for the label
 *
 * The animation source is assets/Lottie/data_loader.json.
 */