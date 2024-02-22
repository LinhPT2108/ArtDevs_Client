import { useIsFocusVisible } from "@mui/material";
import { useEffect, useRef } from "react";

const LoadingMore = () => {
  const container = useRef(null);
  const visible = useIsVisible(container);

  useEffect(() => {
    if (visible) {
      alert("visible");
    }
  }, [visible]);
  return <div ref="container" className="spinner"></div>;
};
export default LoadingMore;
