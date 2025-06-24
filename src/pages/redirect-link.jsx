import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();

  const {loading, data, fn} = useFetch(getLongUrl, id);

  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading, data]);

  // ADD THIS: Redirect after storing the click
  useEffect(() => {
    if (!loading && !loadingStats && data?.original_url) {
      // Add a small delay to ensure click is stored
      setTimeout(() => {
        window.location.href = data.original_url;
      }, 500);
    }
  }, [loading, loadingStats, data]);

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center">
        <BarLoader width={"100%"} color="#06b6d4" />
        <p className="text-white mt-4">Redirecting...</p>
      </div>
    );
  }

  // If no data found, show error
  if (!loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6">This link doesn't exist or has been removed.</p>
          <a 
            href="https://shrinklit-rose.vercel.app/" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectLink;
