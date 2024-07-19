import * as React from "react";

interface BoxProps {
  title: string;
  children: React.ReactNode;
  inactive?: boolean;
  action?: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({
  title,
  children,
  inactive = false,
  action = null,
}) => {
  return (
    <div className={`box ${inactive ? "inactive" : ""}`}>
      {!inactive && <div className="box-title">{title}</div>}
      {action && <div className="box-action">{action}</div>}
      <div className="box-content">{children}</div>
    </div>
  );
};

export default Box;
