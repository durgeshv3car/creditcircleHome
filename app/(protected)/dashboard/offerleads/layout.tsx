import { Metadata } from "next";

export const metadata:Metadata={
  title: 'Credit',
  description: 'Credit Description'
}
const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;