import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section with Background */}
      <div 
        className="relative w-full min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Chain Link Icon in Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg 
            width="800" 
            height="800" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-cyan-400"
          >
            <path 
              d="M9 7H7C5.89543 7 5 7.89543 5 9V15C5 16.1046 5.89543 17 7 17H9M15 7H17C18.1046 7 19 7.89543 19 9V15C19 16.1046 18.1046 17 17 17H15M9 12H15" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mb-4">
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-white"
              >
                <path 
                  d="M9 7H7C5.89543 7 5 7.89543 5 9V15C5 16.1046 5.89543 17 7 17H9M15 7H17C18.1046 7 19 7.89543 19 9V15C19 16.1046 18.1046 17 17 17H15M9 12H15" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">SHRINKIT</h1>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Shrink long URLs{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              fast, smartly
            </span>{" "}
            and beautifully.
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            The only URL shortener you'll ever need! Create short, memorable links with detailed analytics.
          </p>

          {/* URL Shortener Form */}
          <form
            onSubmit={handleShorten}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16"
          >
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Enter a loooong URL"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-14 px-6 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 font-semibold"
            >
              Shorten!
            </Button>
          </form>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Generate short URLs in milliseconds</p>
            </div>
            
            {/* Detailed Analytics Icon */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Analytics</h3>
              <p className="text-gray-400">Track clicks and analyze performance</p>
            </div>
            
            {/* Detailed QR Code Icon */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <rect x="3" y="3" width="5" height="5" fill="currentColor"/>
                  <rect x="3" y="16" width="5" height="5" fill="currentColor"/>
                  <rect x="16" y="3" width="5" height="5" fill="currentColor"/>
                  <rect x="5" y="5" width="1" height="1" fill="white"/>
                  <rect x="5" y="18" width="1" height="1" fill="white"/>
                  <rect x="18" y="5" width="1" height="1" fill="white"/>
                  <rect x="11" y="5" width="1" height="1" fill="currentColor"/>
                  <rect x="13" y="5" width="1" height="1" fill="currentColor"/>
                  <rect x="11" y="7" width="1" height="1" fill="currentColor"/>
                  <rect x="13" y="7" width="1" height="1" fill="currentColor"/>
                  <rect x="11" y="11" width="1" height="1" fill="currentColor"/>
                  <rect x="13" y="11" width="1" height="1" fill="currentColor"/>
                  <rect x="15" y="11" width="1" height="1" fill="currentColor"/>
                  <rect x="17" y="11" width="1" height="1" fill="currentColor"/>
                  <rect x="19" y="11" width="1" height="1" fill="currentColor"/>
                  <rect x="11" y="13" width="1" height="1" fill="currentColor"/>
                  <rect x="15" y="13" width="1" height="1" fill="currentColor"/>
                  <rect x="17" y="13" width="1" height="1" fill="currentColor"/>
                  <rect x="11" y="15" width="1" height="1" fill="currentColor"/>
                  <rect x="13" y="15" width="1" height="1" fill="currentColor"/>
                  <rect x="15" y="15" width="1" height="1" fill="currentColor"/>
                  <rect x="19" y="15" width="1" height="1" fill="currentColor"/>
                  <rect x="11" y="17" width="1" height="1" fill="currentColor"/>
                  <rect x="15" y="17" width="1" height="1" fill="currentColor"/>
                  <rect x="17" y="17" width="1" height="1" fill="currentColor"/>
                  <rect x="19" y="17" width="1" height="1" fill="currentColor"/>
                  <rect x="11" y="19" width="1" height="1" fill="currentColor"/>
                  <rect x="13" y="19" width="1" height="1" fill="currentColor"/>
                  <rect x="17" y="19" width="1" height="1" fill="currentColor"/>
                  <rect x="19" y="19" width="1" height="1" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">QR Code Ready</h3>
              <p className="text-gray-400">Auto-generate QR codes for easy sharing</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-4xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-white">
          Frequently Asked Questions
        </h3>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-cyan-400">
              How does the Shrinklit URL shortener work?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300">
              When you enter a long URL, our system generates a shorter version of
              that URL. This shortened URL redirects to the original long URL when
              accessed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-cyan-400">
              Do I need an account to use the app?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300">
              Yes. Creating an account allows you to manage your URLs, view
              analytics, and customize your short URLs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-cyan-400">
              What analytics are available for my shortened URLs?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300">
              You can view the number of clicks, geolocation data of the clicks
              and device types (mobile/desktop) for each of your shortened URLs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default LandingPage;
