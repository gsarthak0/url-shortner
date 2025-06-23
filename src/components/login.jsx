import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import Error from "./error";
import {login} from "@/db/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";
import {Mail, Lock} from "lucide-react";

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {loading, error, fn: fnLogin, data} = useFetch(login, formData);
  const {fetchUser} = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnLogin();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-6">
      {error && <Error message={error.message} />}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleInputChange}
              className="pl-10 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>
          {errors.email && <Error message={errors.email} />}
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleInputChange}
              className="pl-10 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>
      </div>

      <Button 
        onClick={handleLogin}
        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 font-semibold"
        disabled={loading}
      >
        {loading ? <BeatLoader size={10} color="white" /> : "Sign In"}
      </Button>

      <div className="text-center">
        <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 underline">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default Login;
