import { Link } from "@/i18n/routing";
import RegForm from "@/components/partials/auth/reg-form";
import Image from "next/image";
import Copyright from "@/components/partials/auth/copyright";
import Logo from "@/components/partials/auth/logo";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
}

const Register = async () => {
  const session = await auth();
  let role = "";
  let token = "";
  let permissions: string[] = [];

  if (session?.user && "token" in session.user) {
    const decoded = jwtDecode<DecodedToken>(
      (session.user as { token: string }).token
    );
    token = (session.user as { token: string }).token;
    role = decoded.role;
    permissions = (session.user as any).permissions || [];
  }

  const allowed = "Create Account";
  if (role != "Super Admin" && !permissions.includes(allowed)) {
    notFound();
  }
  return (
    <>
      <div className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full">
        <div className="overflow-y-auto flex flex-wrap w-full h-dvh">
          <div
            className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 
           relative z-[1] bg-default-50"
          >
            <div className="md:w-1/2 m-auto h-full w-full flex justify-center items-center">
              <div>
                <Image
                  alt=""
                  loading="lazy"
                  width="500"
                  height="500"
                  decoding="async"
                  data-nimg="1"
                  className="object-contain"
                  src="/images/logo/logo.svg"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 relative dark:bg-default-100 bg-white ">
            <div className=" h-full flex flex-col">
              <div className="max-w-[524px] md:px-[42px] md:py-[44px] p-7  mx-auto w-full text-2xl text-default-900  mb-3 h-full flex flex-col justify-center">
                <div className="flex justify-center items-center text-center mb-6 lg:hidden ">
                  <Link href="/">
                    <Logo />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-5">
                  <h4 className="font-medium">Sign up</h4>
                  <div className="text-default-500  text-base">
                    Create an account to start using Dashcode
                  </div>
                </div>
                <RegForm roleType={role} />
                {/* <div className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className=" absolute inline-block  bg-default-50 dark:bg-default-100 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-default-500  font-normal ">
                    Or continue with
                  </div>
                </div> */}

                <div className="max-w-[225px] mx-auto font-normal text-default-500  2xl:mt-12 mt-6 uppercase text-sm">
                  Already registered?
                  <Link
                    href={token ? "/dashboard" : "/auth/login"}
                    className="text-default-900  font-medium hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="text-xs font-normal text-default-500 z-[999] pb-10 text-center">
                <Copyright />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
