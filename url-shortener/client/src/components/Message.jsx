import React, { useEffect } from "react";

const Message = ({ type, message }) => {
  useEffect(() => {
    const timer = setTimeout(
      () => {
        // Auto-hide message after 5 seconds
        const element = document.querySelector(`.${type}-message`);
        if (element) {
          element.style.display = "none";
        }
      },
      type === "error" ? 5000 : 3000
    );

    return () => clearTimeout(timer);
  }, [type]);

  return (
    <div className={`${type}-message`}>
      <i
        className={`fas ${
          type === "error" ? "fa-exclamation-triangle" : "fa-check-circle"
        }`}
      ></i>
      <span>{message}</span>
    </div>
  );
};

export default Message;
