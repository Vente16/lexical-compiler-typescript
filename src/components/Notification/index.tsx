import { FC } from 'react';
import { FailtureIcon, SuccessIcon } from '../Icons';

interface Props {
  type?: 'SUCCESS' | 'FAILURE';
  title: string;
  message: string;
}

const Notification: FC<Props> = ({ type, title, message }) => {
  if (type === 'SUCCESS') {
    return (
      <div
        className="bg-white mt-4 border-t-4 border-teal-500 rounded-b px-4 py-3 shadow-md w-full"
        role="alert">
        <div className="flex">
          <div className="py-1">
            <SuccessIcon />
          </div>
          <div>
            <p className="font-bold text-teal-900">{title}</p>
            <p className="text-sm ">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  if (type === 'FAILURE') {
    return (
      <div
        className="bg-white mt-4 border-t-4 border-red-500 rounded-b px-4 py-3 shadow-md w-full"
        role="alert">
        <div className="flex">
          <div className="py-1">
            <FailtureIcon />
          </div>
          <div>
            <p className="font-bold text-red-900">{title}</p>
            <p className="text-sm "> An error occurred during compilation.</p>
            <p className="text-sm text-red-500">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Notification;
