import {useEffect, useState} from "react";
import Error from "./error";
import {Input} from "./ui/input";
import * as Yup from "yup";
import {Button} from "./ui/button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {signup} from "@/db/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {User, Mail, Lock} from "lucide-react";

const Signup = ({ onSwitchToLogin }) => { // Add this prop
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
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

  const {loading, error, fn: fnSignup, data} = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data, navigate, longLink]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({api: error.message});
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && <Error message={error?.message} />}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="name"
              type="text"
              placeholder="Enter your full name"
              onChange={handleInputChange}
              className="pl-10 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>
          {errors.name && <Error message={errors.name} />}
        </div>
        
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
              placeholder="Create a password"
              onChange={handleInputChange}
              className="pl-10 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>
      </div>

      <Button 
        onClick={handleSignup}
        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 font-semibold"
        disabled={loading}
      >
        {loading ? (
          <BeatLoader size={10} color="white" />
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <span 
            className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors"
            onClick={onSwitchToLogin} // Add click handler
          >
            Login instead
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
