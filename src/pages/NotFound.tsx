import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground">

      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-blue)/0.15)] via-transparent to-[hsl(var(--neon-purple)/0.15)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 rounded-2xl border border-border bg-card/60 p-12 backdrop-blur-xl shadow-2xl text-center max-w-lg"
      >
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-14 w-14 text-[hsl(var(--neon-purple))]" />
        </div>

        <h1 className="text-7xl font-bold tracking-tight mb-3 bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))] bg-clip-text text-transparent">
          404
        </h1>

        <p className="text-lg text-muted-foreground mb-6">
          AI Navigation Error — The route{" "}
          <span className="text-foreground font-medium">
            {location.pathname}
          </span>{" "}
          does not exist.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-medium transition hover:bg-secondary/80 hover:shadow-lg"
        >
          <Home className="h-4 w-4" />
          Return to Command Center
        </Link>

      </motion.div>
    </div>
  );
};

export default NotFound;