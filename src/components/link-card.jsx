import {Copy, Download, LinkIcon, Trash, ExternalLink, Calendar, BarChart3} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import {Card, CardContent} from "./ui/card";
import useFetch from "@/hooks/use-fetch";
import {deleteUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

const LinkCard = ({url = [], fetchUrls}) => {
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

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url.id);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${CLIENT_URL}/${url?.custom_url ? url?.custom_url : url.short_url}`);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-lg p-2 ring-2 ring-cyan-400/30">
              <img
                src={url?.qr}
                className="w-full h-full object-contain"
                alt="QR code"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Link to={`/link/${url?.id}`} className="group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors truncate">
                {url?.title}
              </h3>
            </Link>
            
            <div className="space-y-3">
              {/* Short URL */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
                  <LinkIcon className="w-3 h-3 text-white" />
                </div>
                <Link 
                  to={`/link/${url?.id}`}
                  className="text-cyan-400 hover:text-cyan-300 font-medium truncate"
                >
                  ${CLIENT_URL}/{url?.custom_url ? url?.custom_url : url.short_url}
                </Link>
              </div>

              {/* Original URL */}
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a 
                  href={url?.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white truncate text-sm"
                >
                  {url?.original_url}
                </a>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  {new Date(url?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="border-slate-600 bg-slate-700/50 text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-400"
            >
              <Copy className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadImage}
              className="border-slate-600 bg-slate-700/50 text-gray-300 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-400"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Link to={`/link/${url?.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-700/50 text-gray-300 hover:bg-green-500/10 hover:border-green-400 hover:text-green-400 w-full"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fnDelete().then(() => fetchUrls())}
              disabled={loadingDelete}
              className="border-slate-600 bg-slate-700/50 text-gray-300 hover:bg-red-500/10 hover:border-red-400 hover:text-red-400"
            >
              {loadingDelete ? <BeatLoader size={12} color="#ef4444" /> : <Trash className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
