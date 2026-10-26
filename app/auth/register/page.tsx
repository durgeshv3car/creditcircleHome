import { Link } from "@/i18n/routing";
import RegForm from "@/components/partials/auth/reg-form";
import Copyright from "@/components/partials/auth/copyright";
import Image from "next/image";
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
    <div className="flex w-full min-h-screen h-screen overflow-hidden bg-white">
      <div className="flex flex-col lg:flex-row w-full h-full overflow-y-auto">
        {/* Left Side: Large Credit Circle Logo */}
        <div className="lg:flex hidden flex-1 items-center justify-center p-8 xl:p-16 bg-[#F6F8FC] border-r border-slate-200">
          <div className="w-full max-w-[360px] xl:max-w-[420px] flex items-center justify-center">
            <Image
              src="/images/logo/logo.svg"
              alt="Credit Circle"
              width={420}
              height={300}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-white min-h-screen overflow-y-auto">
          <div className="max-w-[400px] w-full mx-auto my-auto space-y-6">
            {/* Mobile Logo for small screens */}
            <div className="flex justify-center items-center text-center mb-4 lg:hidden">
              <Link href="/">
                <Image
                  src="/images/logo/logo.svg"
                  alt="Credit Circle"
                  width={200}
                  height={140}
                  priority
                  className="w-40 h-auto object-contain"
                />
              </Link>
            </div>

            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                Sign up
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                Create an account to start using Credit Circle
              </p>
            </div>

            {/* Form */}
            <RegForm roleType={role} token={token} />

            {/* Bottom Link */}
            <div className="text-center text-xs tracking-wider uppercase text-slate-500 pt-2">
              ALREADY REGISTERED?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-slate-900 hover:underline"
              >
                SIGN IN
              </Link>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center pt-6">
            <Copyright />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
