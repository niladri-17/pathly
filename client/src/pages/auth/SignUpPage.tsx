import Header from "@/components/layout/Header";
import SignUpForm from "@/features/auth/components/SignUpForm";

const SignUpPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="bg-background text-foreground">
        <div className="flex justify-between min-h-72">
          {/* Left side - Login Form */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <SignUpForm />
            </div>
          </div>
          {/* Spacer */}
          <div className="hidden lg:block w-px bg-border self-stretch"></div>

          {/* Right side */}
          <div className="relative hidden lg:flex flex-1 items-center justify-center">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 backdrop-blur-sm border border-border/50">
              <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                <div className="rounded-full bg-primary/10 p-6 border border-primary/20">
                  <svg
                    className="h-16 w-16 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Start your journey with Pathly
                  </h2>
                  <p className="text-muted-foreground max-w-sm">
                    Explore new horizons, mentor others, and build meaningful
                    connections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
