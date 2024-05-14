"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, AuthProvider } from "@/lib/authprovider";
import { env } from "process";
import { redirect } from "next/navigation";
import Comind from "@/lib/comind";
import { Button, ButtonGroup, Container, Input, Space } from "@mantine/core";
import Shell from "../Shell";

import LoginForm from "@/app/login/LoginForm";

const LoginPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
};

export default LoginPage;

// const LoginPage: React.FC = () => {
//   const { token, login } = useContext(AuthContext);

//   const [username, setUsername] = useState("test");
//   const [password, setPassword] = useState("test");

//   // If we're already logged in, then
//   // redirect to the home page.
//   if (token) {
//     console.log("Already logged in. Redirecting to home page.");
//     redirect("/");
//   }

//   // Check if we're in debug mode. If so, fill in the username and
//   // password fields with some default values and log in automatically.
//   if (process.env.COMIND_DEBUG === "true") {
//     console.log("In debug mode. Logging in directly.");
//     login(username, password);
//   }

//   const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setUsername(event.target.value);
//   };

//   const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(event.target.value);
//   };

//   const handleLoginClick = () => {
//     console.log(
//       "Logging in with username:",
//       username,
//       "and password:",
//       password
//     );
//     // Call login for the auth service
//     login(username, password);
//   };

//   return (
//     <Shell>
//       <Container size="sm">
//         <form onSubmit={handleLoginClick}>
//           <div className="instruction">
//             wanna log in to <Comind />?
//           </div>
//           <Space h="md" />
//           <Input
//             size="lg"
//             onChange={handleUsernameChange}
//             placeholder="username"
//             autoComplete="username"
//           />
//           <Space h="md" />
//           <Input
//             size="lg"
//             type="password"
//             placeholder="password"
//             value={password}
//             onChange={handlePasswordChange}
//             autoComplete="current-password"
//           />
//           <Space h="md" />
//           <ButtonGroup>
//             <Button type="submit" variant="default">
//               Login
//             </Button>
//             {/* <Button onClick={handleLoginClick} variant="ghost">
//                   Sign up
//                 </Button> */}
//           </ButtonGroup>
//         </form>
//       </Container>
//     </Shell>
//   );
// };

// export default LoginPage;
