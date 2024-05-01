import Box from "@mui/material/Box";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";
interface IPros {
  postId: string;
  content: string;
  session: User;
  programingLanguage: MyLanguageProgram[] | undefined;
}
const ContentPost = ({
  session,
  programingLanguage,
  postId,
  content,
}: IPros) => {
  //test
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 1,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && programingLanguage) {
      let listLanguage = [];
      timer = setTimeout(async () => {
        for (const language of programingLanguage) {
          if (content.includes(language.languageName)) {
            listLanguage.push(language.languageName);
          }
        }
        if (listLanguage.length > 0) {
          const resPriority = await sendRequest<string[]>({
            method: "POST",
            url: GLOBAL_URL + "/api/inscrease-priority",
            headers: { authorization: `Bearer ${session?.access_token}` },
            queryParams: { languages: listLanguage },
          });
        }
      }, 20000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, content]);

  return (
    <Link href={`/post?id=${postId}`}>
      <Box ref={elementRef} sx={{ marginLeft: "12px", marginBottom: "12px" }}>
        {content}
      </Box>
    </Link>
  );
};
export default ContentPost;
