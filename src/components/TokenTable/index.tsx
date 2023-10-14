import { FC } from 'react';
import { Token } from '../../types';

type Nullable<T> = T | null;

interface Props {
  data: Nullable<Token>[];
}

const TokenTable: FC<Props> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded my-6 w-full">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="py-3 px-6 text-left whitespace-nowrap font-semibold text-gray-600 uppercase">
              Token Type
            </th>
            <th className="py-3 px-6 text-left whitespace-nowrap font-semibold text-gray-600 uppercase">
              Token Value
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((token, index) =>
            token ? (
              <tr key={index}>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {token.type}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {token.value}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;
