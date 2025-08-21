import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {QRCode} from "react-qr-code";
import {useRef, useState, useEffect} from "react";
import * as yup from "yup";
import ErrorMessage from "./error"; // RENAMED: Error -> ErrorMessage
import {createUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";

// Utility: Convert SVG element to PNG blob
async function svgToPngBlob(svgElement, size = 200) {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new window.Image();
  img.width = size;
  img.height = size;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert SVG to PNG blob"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function CreateLink() {
  const {user} = UrlState();
  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {loading, error, fn: fnCreateUrl, data} = useFetch(createUrl);

  // Close dialog and refresh when link is created successfully
  useEffect(() => {
    if (data && !loading && !error) {
      console.log("Link created successfully:", data);
      setSearchParams({}); 
      // Navigate to /link/{id} where id is the id of the created link
      const linkId = data?.id || data?.link?.id;
      console.log("Navigating to link ID:", data);
      if (linkId) {
        navigate(`/link/${linkId}`);
      } else {
        navigate("/dashboard"); // fallback
      }
    }
  }, [data, loading, error, setSearchParams, navigate]);

  const createNewLink = async () => {
    console.log("Button clicked");
    setErrors([]);
    try {
      console.log("Starting validation...");
      await schema.validate(formValues, {abortEarly: false});
      
      console.log("Validation passed, generating QR code...");
      
      // Wait a bit for QR code to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const svg = ref.current?.querySelector("svg");
      if (!svg) {
        throw new Error("QR code SVG not found");
      }
      
      console.log("SVG found, generating blob...");
      
      const blob = await svgToPngBlob(svg, 200);
      
      console.log("Blob generated, creating URL...");
      console.log("Form values:", formValues);
      
      await fnCreateUrl({ ...formValues, user_id: user.id }, blob);
      
    } catch (error) {
      console.error("Error creating link:", error);
      
      if (error?.inner) {
        // Validation errors
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        // Other errors
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl text-white">Create New Link</DialogTitle>
        </DialogHeader>

        {formValues?.longUrl && (
          <div ref={ref} className="flex justify-center p-4 bg-white rounded-lg">
            <QRCode 
              value={`https://shrinklit-rose.vercel.app/${formValues?.customUrl || "temp-link"}`}
              size={200}
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Input
              id="title"
              placeholder="Short Link's Title"
              value={formValues.title}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
            {errors.title && <ErrorMessage message={errors.title} />}
          </div>

          <div>
            <Input
              id="longUrl"
              placeholder="Enter your Loooong URL"
              value={formValues.longUrl}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
            {errors.longUrl && <ErrorMessage message={errors.longUrl} />}
          </div>

          <div className="flex items-center gap-2">
            <Card className="p-2 bg-slate-700 border-slate-600 text-white text-sm">
              shrinklit-rose.vercel.app
            </Card>
            <span className="text-gray-400">/</span>
            <Input
              id="customUrl"
              placeholder="Custom Link (optional)"
              value={formValues.customUrl}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>
          {errors.customUrl && <ErrorMessage message={errors.customUrl} />}
        </div>

        {error && <ErrorMessage message={error.message} />}
        {errors.general && <ErrorMessage message={errors.general} />}

        <DialogFooter>
          <Button
            type="button"
            onClick={createNewLink}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
