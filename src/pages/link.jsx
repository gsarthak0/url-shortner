import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UrlState} from "@/context";
import {getClicksForUrl} from "@/db/apiClicks";
import {deleteUrl, getUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {Copy, Download, LinkIcon, Trash, ExternalLink, Calendar, BarChart3, TrendingUp} from "lucide-react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const navigate = useNavigate();
  const {user} = UrlState();
  const {id} = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, {id, user_id: user?.id});

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${CLIENT_URL}/${link}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {(loading || loadingStats) && (
          <BarLoader className="mb-6" width={"100%"} color="#06b6d4" />
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Link Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Main Link Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 break-words">
                      {url?.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Created {new Date(url?.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Short URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-400">Short URL</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
                        <LinkIcon className="w-4 h-4 text-white" />
                      </div>
                      <a
                        href={`${CLIENT_URL}/${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium text-lg flex-1` break-all"
                      >
                        ${CLIENT_URL}/{link}
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="border-slate-600 bg-slate-700/50 text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-400"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Original URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-400">Original URL</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <ExternalLink className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      <a
                        href={url?.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white flex-1 break-all"
                      >
                        {url?.original_url}
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      onClick={copyToClipboard}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={downloadImage}
                      className="border-slate-600 bg-slate-700/50 text-gray-300 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-400"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() =>
                        fnDelete().then(() => {
                          navigate("/dashboard");
                        })
                      }
                      disabled={loadingDelete}
                      className="border-slate-600 bg-slate-700/50 text-gray-300 hover:bg-red-500/10 hover:border-red-400 hover:text-red-400"
                    >
                      {loadingDelete ? (
                        <BeatLoader size={12} color="#ef4444" />
                      ) : (
                        <>
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                      <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                      <rect x="3" y="16" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                      <rect x="16" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg ring-2 ring-cyan-400/30">
                    <img
                      src={url?.qr}
                      className="w-48 h-48 object-contain"
                      alt="QR code"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Statistics */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400 text-2xl font-bold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Stats
                </CardTitle>
              </CardHeader>
              {stats && stats.length ? (
                <CardContent className="space-y-6">
                  {/* Total Clicks */}
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Clicks</p>
                          <p className="text-3xl font-bold text-white">{stats?.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Data */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Location Data</h3>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <Location stats={stats} />
                    </div>
                  </div>

                  {/* Device Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Device Info</h3>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <DeviceStats stats={stats} />
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400">
                      {loadingStats === false
                        ? "No statistics yet"
                        : "Loading statistics..."}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPage;
