import Header from "@/components/header";
import AnimatedBackground from "@/components/animated-background";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen relative">
      {/* Fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-[-10]" />
      
      {/* Animated cursor effect */}
      <AnimatedBackground />
      
      {/* Main content */}
      <main className="min-h-screen container relative z-10">
        <Header />
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-700 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              Made by{" "}
              <a 
                href="https://www.linkedin.com/in/sarthakgaikwad0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors font-medium"
              >
                Sarthak
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
