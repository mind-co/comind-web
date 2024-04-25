import Link from "next/link";
import React from "react";

const Comind: React.FC = () => {
  return (
    <Link href="/" className="comind-logo">
      <span className="comind-logo-co">co</span>
      <span className="comind-logo-mi">mi</span>
      <span className="comind-logo-nd">nd</span>
    </Link>
  );
};

export default Comind;
