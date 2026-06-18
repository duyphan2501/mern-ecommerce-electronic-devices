import { Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import FallbackLoading from "./Loading/FallbackLoading";

const MotionDiv = motion.div;

const LazyComponentWrapper = ({
  importFunc,
  fallback = <FallbackLoading />,
  ...props
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [LazyComponent, setLazyComponent] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (inView && !LazyComponent && !hasError) {
      importFunc()
        .then((mod) => {
          setLazyComponent(() => mod.default);
        })
        .catch((error) => {
          console.error("Lazy component failed to load:", error);
          setHasError(true);
        });
    }
  }, [inView, LazyComponent, hasError, importFunc]);

  return (
    <div ref={ref}>
      {hasError ? (
        fallback
      ) : LazyComponent ? (
        <Suspense fallback={fallback}>
          <MotionDiv
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LazyComponent {...props} />
          </MotionDiv>
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyComponentWrapper;
