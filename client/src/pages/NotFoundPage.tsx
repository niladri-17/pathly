import React from "react";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  // const handleGoHome = () => {
  //   // Navigate to homepage
  //   console.log("Navigating to homepage");

  //   // In a real app: navigate('/') or window.location.href = '/'
  // };

  const handleGoBack = () => {
    // Go back in browser history
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Main 404 Visual */}
        <div className="space-y-6">
          {/* Large 404 Text */}
          <div className="relative">
            <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-700 select-none">
              404
            </h1>
          </div>

          {/* Content Card */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Page not found
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Sorry, we couldn't find the page you're looking for. Please
                  check the URL or navigate back home.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  // onClick={handleGoHome}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  <Link to="/"> Go to homepage</Link>
                </Button>

                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go back
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Floating Elements for Visual Interest */}
          <div className="relative">
            <div className="absolute -top-20 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute -top-32 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 left-1/3 w-16 h-16 bg-pink-500/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Subtle Help Text */}
        <div className="text-sm text-slate-500 dark:text-slate-500 space-y-2">
          <p>
            If you think this is a mistake, please{" "}
            <button
              // onClick={handleHelp}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              contact our support team
            </button>
          </p>
          <p className="text-xs">Error Code: 404 • Page Not Found</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
