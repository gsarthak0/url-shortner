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
import {useRef, useState} from "react";
import * as yup from "yup";
import Error from "./error";
import {createUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";

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

  const {loading, error, fn: fnCreateUrl, data} = useFetch(createUrl, {
    ...formValues,
    user_id: user.id,
  });

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, {abortEarly: false});

      const canvas = ref.current.querySelector("canvas");
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (error) {
      const newErrors = {};

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
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
              value={`https://shrinklit-rose.vercel.app/${formValues?.customUrl ? formValues?.customUrl : "link"}`}
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
            {errors.title && <Error message={errors.title} />}
          </div>

          <div>
            <Input
              id="longUrl"
              placeholder="Enter your Loooong URL"
              value={formValues.longUrl}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
            {errors.longUrl && <Error message={errors.longUrl} />}
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
          {errors.customUrl && <Error message={errors.customUrl} />}
        </div>

        {error && <Error message={error.message} />}

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
