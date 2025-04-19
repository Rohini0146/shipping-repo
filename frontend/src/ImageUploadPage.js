import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ImageUploadPage = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }) => setFileList(fileList);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const handleUpload = async () => {
    // If needed, implement any custom logic here for submitting the file
    message.success('Image uploaded successfully');
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <Upload
        action="http://localhost:5000/upload" // Make sure this matches the backend route
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        name="file" // This should match the field name in the backend
      >
        <Button icon={<UploadOutlined />}>Upload Image</Button>
      </Upload>
      <Button
        type="primary"
        style={{ marginTop: 16 }}
        onClick={handleUpload}
        disabled={fileList.length === 0}
      >
        Submit Image
      </Button>
    </div>
  );
};

export default ImageUploadPage;
