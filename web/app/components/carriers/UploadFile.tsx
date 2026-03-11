
// #  --- AI-ASSISTED ---
// #  Tool: Copilot
// #  Prompt: "Create a component based on my pattern and using the antd package, which I need to upload a JSON file and send it to a router path"
// #  Modifications: Created and reviewd the component.
// #  --- END AI-ASSISTED ---

'use client';

import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import useUploadFile from '../../hooks/useUploadFile';


export default function UploadFile() {
  const { mutateAsync, isPending } = useUploadFile()

  const props: UploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file: RcFile) => {
      const isJson = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
      if (!isJson) {
        message.error('You can only upload a JSON file');
      }
      return isJson ? true : Upload.LIST_IGNORE;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
        
    try {
        const result = await mutateAsync(file as RcFile);
        onSuccess?.(result, file);
        message.success('File uploaded successfully');
      } catch (err) {
        onError?.(err as Error);
        message.error('Upload error');
      }
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />} loading={isPending}>
        Click to Upload JSON
      </Button>
    </Upload>
  );
}
