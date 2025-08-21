import {useState} from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("useFetch: Calling function with args:", args); // Debug log
      
      // If args are provided, use them; otherwise use options
      const response = args.length > 0 ? await cb(...args) : await cb(options);
      
      console.log("useFetch: Response received:", response); // Debug log
      
      setData(response);
      setError(null);
    } catch (error) {
      console.error("useFetch: Error occurred:", error); // Debug log
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {data, loading, error, fn};
};

export default useFetch;
