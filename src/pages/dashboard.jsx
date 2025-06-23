import {useEffect, useState} from "react";
import {BarLoader} from "react-spinners";
import {Filter, Plus, Search} from "lucide-react";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {CreateLink} from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";

import {getUrls} from "@/db/apiUrls";
import {getClicksForUrls} from "@/db/apiClicks";
import {UrlState} from "@/context";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {user} = UrlState();
  const {loading, error, data: urls, fn: fnUrls} = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  // Sort by creation date (latest first)
  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {(loading || loadingClicks) && (
          <BarLoader width={"100%"} color="#06b6d4" className="mb-6" />
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path 
                      d="M9 7H7C5.89543 7 5 7.89543 5 9V15C5 16.1046 5.89543 17 7 17H9M15 7H17C18.1046 7 19 7.89543 19 9V15C19 16.1046 18.1046 17 17 17H15M9 12H15" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                Links Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{urls?.length || 0}</p>
              <p className="text-gray-400 text-sm mt-1">Total shortened URLs</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                Total Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{clicks?.length || 0}</p>
              <p className="text-gray-400 text-sm mt-1">Across all links</p>
            </CardContent>
          </Card>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">My Links</h1>
            <p className="text-gray-400">Manage and track your shortened URLs</p>
          </div>
          <CreateLink />
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search your links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400 backdrop-blur-sm"
            />
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <Error message={error?.message} />
          </div>
        )}

        {/* Links Grid */}
        {filteredUrls && filteredUrls.length > 0 ? (
          <div className="space-y-4">
            {filteredUrls.map((url, i) => (
              <LinkCard key={i} url={url} fetchUrls={fnUrls} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No links yet</h3>
            <p className="text-gray-400 mb-6">Create your first shortened URL to get started</p>
            <CreateLink />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
