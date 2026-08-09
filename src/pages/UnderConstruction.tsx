import { Hammer, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-full">
              <Hammer className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Under Construction
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-lg mb-2">
          We're building something amazing
        </p>
        <p className="text-slate-500 text-sm mb-8">
          This page is currently being worked on. Check back soon!
        </p>

        {/* Loading animation */}
        <div className="flex justify-center gap-2 mb-12">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>

        {/* Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="gap-2 w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default UnderConstruction;
