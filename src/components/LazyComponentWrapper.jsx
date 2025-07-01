import { Suspense, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const LazyComponentWrapper = ({ importFunc, fallback = null }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [LazyComponent, setLazyComponent] = useState(null);

  useEffect(() => {
    if (inView && !LazyComponent) {
      importFunc().then((mod) => {
        setLazyComponent(() => mod.default); 
      });
    }
  }, [inView, LazyComponent, importFunc]);

  return (
    <div ref={ref}>
      {LazyComponent ? (
        <Suspense fallback={fallback || <div>Đang tải...</div>}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LazyComponent />
          </motion.div>
        </Suspense>
      ) : (
        fallback || <div style={{ height: 200 }}>Đang tải...</div>
      )}
    </div>
  );
};

export default LazyComponentWrapper;
