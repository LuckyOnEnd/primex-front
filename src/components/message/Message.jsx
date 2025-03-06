import React, { useEffect } from "react";
import { notification, Space } from "antd";

const Message = ({ message, description, type, placement = "topRight" }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (message) {
      api[type || "info"]({
        message,
        description,
        placement,
      });
    }
  }, [message, description, type, placement, api]);

  return (
    <>
      {contextHolder}
      <Space />
    </>
  );
};

export default Message;
