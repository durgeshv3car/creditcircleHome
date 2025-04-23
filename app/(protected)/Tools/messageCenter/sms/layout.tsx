import { Metadata } from "next";

export const metadata:Metadata={
  title: 'notificationCenter',
  description: 'notificationCenter Description'
}
const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;