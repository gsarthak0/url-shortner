import {useState} from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      // If no args provided, use options
      if (args.length === 0) {
        response = await cb(options);
      } else {
        // If args provided, use them
        response = await cb(...args);
      }
      
      console.log("useFetch response:", response); // Debug log
      setData(response);
      setError(null);
    } catch (error) {
      console.error("useFetch error:", error); // Debug log
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {data, loading, error, fn};
};

export default useFetch;
