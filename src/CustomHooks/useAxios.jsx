import { useEffect, useState } from "react";
import axios from "axios";

const useAxios = (url, method, data, headers) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    if (method.toLowerCase() === "post") {
      axios
        .post(url, data, headers)
        .then(({ data }) =>
          setState({ data: data, loading: false, error: false })
        )
        .catch((err) => {
          setState({ data: null, loading: false, error: true });
        });
    } else {
      axios
        .get(url)
        .then(({ data }) => setState({ data: data, loading: false }))
        .catch((err) => {
          setState({ data: null, loading: false, error: true });
        });
    }
  }, [url, setState, data, method]);

  return state;
};

export default useAxios;
