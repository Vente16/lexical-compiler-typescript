import { FC, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tokenizer } from './checker';
import { SyntaxAnalyzer } from './syntaxis';

import Notification from './components/Notification';
import TokenTable from './components/TokenTable';
import { Token } from '.';
import LoadingPercentage from './components/Loading';
import { ClipBoardIcon, RefreshIcon } from './components/Icons';
import { generateAssemblyPrint } from './utils';

type Nullable<T> = T | null;

enum NotificationTypes {
  'SUCCESS' = 'SUCCESS',
  'FAILURE' = 'FAILURE'
}

type NotificationType = 'SUCCESS' | 'FAILURE' | '';

const App: FC = () => {
  const [valueCodeEditor, setValueCodeEditor] = useState('');
  const [assemblyCode, setAssemblyCode] = useState('');
  const [hasPrintKeyword, setHasPrintKeyword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationType, setNotificationType] =
    useState<NotificationType>('');
  const [notificationBody, setNotificationBody] = useState({
    title: '',
    message: ''
  });
  const [tokensList, setTokensList] = useState<Nullable<Token>[]>([]);
  const onChange = (val: string, _: unknown) => {
    setValueCodeEditor(val);
  };

  const handleSubmitCodeEditor = () => {
    setIsLoading(true);

    try {
      const lexer = new Tokenizer(valueCodeEditor);
      const syntaxAnalyzer = new SyntaxAnalyzer(lexer, valueCodeEditor);
      syntaxAnalyzer.parse();
      const allTokens = syntaxAnalyzer.getTokens() || [];
      const assemblyCode = generateAssemblyPrint(
        valueCodeEditor,
        syntaxAnalyzer.declaredVariablesVal
      );

      setHasPrintKeyword(valueCodeEditor.includes('print'));
      setAssemblyCode(assemblyCode);
      setNotificationType(NotificationTypes.SUCCESS);
      setNotificationBody({
        title: 'Successfully',
        message: 'The compilation was successful.'
      });
      setTokensList(allTokens);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Check if it's an instance of Error (or a subclass of Error)
        console.error('Error:', error.message); // Log the error message
        setAssemblyCode('');
        setNotificationType(NotificationTypes.FAILURE);
        setNotificationBody({
          title: 'Error',
          message: error.message
        });
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="flex justify-center mt-8 px-8">
      <div className="p-4 w-2/3 flex">
        <CodeMirror
          value={valueCodeEditor}
          theme="dark"
          width="50vw"
          height="80vh"
          extensions={[javascript()]}
          className="flex-grow"
          onChange={onChange}
        />
      </div>
      <div className="bg-gray-100 flex flex-col items-center rounded-lg my-4 font-semibold ml-3 text-lg py-10 px-4 mr-6">
        <h2 className="mb-4">Control</h2>
        <button
          className="flex text-white bg-green-500 hover:bg-green-600 font-semibold px-5 py-2.5 text-center  inline-flex items-center rounded"
          type="button"
          onClick={handleSubmitCodeEditor}>
          Compile
          <RefreshIcon loading={isLoading} />
        </button>
      </div>

      <div className="bg-gray-100 flex flex-col  items-center py-6 w-full rounded-lg my-4 font-semibold ml-3 text-lg px-5 ">
        <h2>{isLoading ? 'Compiling...' : 'Result compilation'}</h2>

        {notificationType === 'SUCCESS' && !isLoading && hasPrintKeyword && (
          <CopyToClipboard text={assemblyCode}>
            <button
              className="flex text-white bg-blue-500 hover:bg-blue-600 font-semibold px-5 py-2.5 text-center  inline-flex items-center rounded"
              type="button">
              Assembly code &nbsp;&nbsp;
              <ClipBoardIcon width="30" height="30" />
            </button>
          </CopyToClipboard>
        )}

        {isLoading && <LoadingPercentage />}
        {notificationType && !isLoading && (
          <Notification type={notificationType} {...notificationBody} />
        )}
        {notificationType === 'SUCCESS' &&
          !isLoading &&
          Boolean(tokensList.length) && <TokenTable data={tokensList} />}
      </div>
    </div>
  );
};
export default App;
