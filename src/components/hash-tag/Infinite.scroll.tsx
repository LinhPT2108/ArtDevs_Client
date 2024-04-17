import React, { useEffect, useRef } from "react";

interface IPros {
  children: any;
  loader: any;
  fetchMore: any;
  hasMore: any;
  endMessage: any;
  className: any;
  totalPage: number;
}

const InfiniteScroll = ({
  children,
  loader,
  fetchMore,
  hasMore,
  endMessage,
  className,
  totalPage,
}: IPros) => {
  const pageEndRef = useRef(null);
  useEffect(() => {
    if (hasMore) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log(">>> check co vi khon: ");
          fetchMore();
        }
      });

      if (pageEndRef.current) {
        observer.observe(pageEndRef.current);
      }

      return () => {
        if (pageEndRef.current) {
          observer.unobserve(pageEndRef.current);
        }
      };
    }
  }, [hasMore]);
  return (
    <div className={className}>
      {children}
      {totalPage > 1 ? (
        hasMore ? (
          <div ref={pageEndRef}>{loader}</div>
        ) : (
          endMessage
        )
      ) : (
        ""
      )}
    </div>
  );
};

export default InfiniteScroll;
