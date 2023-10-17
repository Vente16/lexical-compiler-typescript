import { FC } from 'react';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const iconsList = {
  SUCCESS: (): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"></path>
    </svg>
  ),
  FAILURE: (): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
};

export const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"></path>
  </svg>
);

export const FailtureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface PropsRefreshIcon {
  loading: boolean;
}

export const RefreshIcon: FC<PropsRefreshIcon> = ({ loading }) => {
  const spinnerClass = loading ? 'animate-spin' : '';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`inline ml-3 w-4 h-4 text-white ${spinnerClass}`}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
};

export const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="ic nz sb">
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clip-rule="evenodd"></path>
    </svg>
  );
};

interface PropsClipBoardIcon {
  width: string;
  height: string;
  color?: string;
}

export const ClipBoardIcon: FC<PropsClipBoardIcon> = ({ width, height, color = 'white' }) => {
  const svgStyle = {
    fill: color, // Apply the specified color to the SVG path
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 1792 1792"
      id="clipboard"
      style={svgStyle}
    >
      <path d="M768 1664h896v-640h-416q-40 0-68-28t-28-68V512H768v1152zm256-1440v-64q0-13-9.5-22.5T992 128H288q-13 0-22.5 9.5T256 160v64q0-13 9.5 22.5T288 256h704q13 0-22.5-9.5t9.5-22.5zm256 672h299l-299-299v299zm512 128v672q0 40-28 68t-68 28H736q-40 0-68-28t-28-68v-160H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h1088q40 0 68 28t28 68v328q21 13 36 28l408 408q28 28 48 76t20 88z"></path>
    </svg>
  );
};
