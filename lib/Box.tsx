import * as React from "react";

interface BoxProps {
  title: string;
  children: React.ReactNode;
  inactive?: boolean;
}

const Box: React.FC<BoxProps> = ({ title, children, inactive = false }) => {
  return (
    <div className={`box ${inactive ? "inactive" : ""}`}>
      {!inactive && <div className="box-title">{title}</div>}
      <div className="box-content">{children}</div>
    </div>
  );
};

export default Box;
