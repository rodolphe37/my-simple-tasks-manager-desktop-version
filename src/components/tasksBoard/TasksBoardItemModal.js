// eslint-disable-next-line no-unused-vars
import { useEffect, useRef, useState } from "react";
import { Modal, Form, Input } from "antd";
import { useRecoilState } from "recoil";
import clickedAddToDoAtom from "../../statesManager/atoms/clickedAddToDoAtom";
// import Item from "antd/lib/list/Item";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState } from "draft-js";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function TaskboardItemModal({ visible, initialValues, onCancel, onOk }) {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [clickedAddButton, setClickedAddButton] =
    useRecoilState(clickedAddToDoAtom);

  useEffect(() => {
    if (visible) {
      // Focus on the first input when the modal is opened
      inputRef.current?.focus();
      form.resetFields();
    }
  }, [form, visible]);

  // set date for each message
  let d = new Date();
  let n = d.toLocaleString();

  // function uploadImageCallBack(file) {
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open("POST", "https://api.imgur.com/3/image");
  //     xhr.setRequestHeader("Authorization", "Client-ID rodolphe37");
  //     const data = new FormData();
  //     data.append("image", file);
  //     xhr.send(data);
  //     xhr.addEventListener("load", () => {
  //       const response = JSON.parse(xhr.responseText);
  //       resolve(response);
  //     });
  //     xhr.addEventListener("error", () => {
  //       const error = JSON.parse(xhr.responseText);
  //       reject(error);
  //     });
  //   });
  // }

  // const EditorOption = () => {
  //   const [state, setState] = useState({
  //     editorState: EditorState.createEmpty(),
  //   });

  //   const onEditorStateChange = (editorState) => {
  //     setState({
  //       editorState,
  //     });
  //   };
  //   const { editorState } = state;
  //   return (
  //     <Editor
  //       editorState={editorState}
  //       onEditorStateChange={onEditorStateChange}
  //       toolbarClassName="toolbarClassName"
  //       wrapperClassName="wrapperClassName"
  //       editorClassName="editorClassName"
  //       toolbar={{
  //         options: [
  //           "inline",
  //           "blockType",
  //           "fontSize",
  //           "fontFamily",
  //           "list",
  //           "textAlign",
  //           "colorPicker",
  //           "link",
  //           "embedded",
  //           "emoji",
  //           "image",
  //           "remove",
  //           "history",
  //         ],
  //         inline: { inDropdown: true },
  //         list: { inDropdown: true },
  //         textAlign: { inDropdown: true },
  //         link: { inDropdown: true },
  //         history: { inDropdown: true },
  //         image: {
  //           uploadCallback: uploadImageCallBack,
  //           alt: { present: true, mandatory: true },
  //         },
  //       }}
  //       hashtag={{
  //         separator: " ",
  //         trigger: "#",
  //       }}
  //     />
  //   );
  // };

  useEffect(() => {
    // console.log("setClickedAddButton", clickedAddButton);
  }, [clickedAddButton]);

  return (
    <Modal
      title="Add Item"
      visible={visible}
      destroyOnClose
      // To make dynamically changing initialValues work with Form
      forceRender
      onCancel={onCancel}
      setClickedAddButton={setClickedAddButton}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={(values) => {
          // console.log(values);
          setClickedAddButton(false);
          onOk(values);
          form.resetFields();
          onCancel();
        }}
      >
        <Form.Item label="Date">{n}</Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: "'Title' is required" },
            {
              max: 100,
              message: "'Title' can not be longer than 100 characters",
            },
          ]}
        >
          <Input ref={inputRef} autoFocus />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "'Description' is required" },
            {
              max: 400,
              message: "'Description' can not be longer than 400 characters",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item></Form.Item>
        <Form.Item></Form.Item>
        {/*<Form.Item>
          <EditorOption
            ref={inputRef}
            name="description"
            label="Description"
            rules={[
              { required: true, message: "'Description' is required" },
              {
                max: 400,
                message: "'Description' can not be longer than 400 characters",
              },
            ]}
          />
        </Form.Item>*/}
      </Form>
    </Modal>
  );
}

export default TaskboardItemModal;
