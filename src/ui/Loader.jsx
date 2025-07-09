/**
 * Loader - A reusable Lottie-based spinner for navigation/page loading.
 *
 * Usage:
 *   import Loader from '../ui/Loader';
 *   ...
 *   {isLoading && <Loader label="Loading page..." />}
 *
 * Props:
 *   - size (number): Width/height in px (default: 80)
 *   - style (object): Custom style object
 *   - className (string): Extra class names for the wrapper
 *   - label (string): Text label below the animation (default: "Loading...")
 *   - labelClassName (string): Extra class names for the label
 *
 * The animation source is assets/Lottie/loading_spinner.json.
 */
import Lottie from 'lottie-react';
import loadingSpinner from '../assets/Lottie/loading_spinner.json';

export default function Loader({
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
        <Lottie animationData={loadingSpinner} loop autoplay />
      </div>
      <span className={`mt-2 text-gray-600 text-sm ${labelClassName}`}>{label}</span>
    </div>
  );
}
/**
 * Loader is the default spinner for navigation/page loading (e.g., in PrivateRoute).
 * For data fetch loading, use DataLoader instead.
 * Example for full-page loading:
 *   import Loader from '../ui/Loader';
 *   ...
 *   {isLoading && <Loader label="Loading page..." />}
 */