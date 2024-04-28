import Box from "@mui/material/Box";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";
interface IPros {
  hashtags: Hashtag[];
  session: User;
  programingLanguage: MyLanguageProgram[] | undefined;
}
const HashtagPost = ({ hashtags, session, programingLanguage }: IPros) => {
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
          for (const hashtag of hashtags) {
            if (
              language.languageName.toLowerCase() ==
              hashtag.hashtagDetailName.toLowerCase()
            ) {
              listLanguage.push(language.languageName);
              break;
            }
          }
        }
        if (listLanguage.length > 0) {
          const resPriority = await sendRequest<string[]>({
            method: "POST",
            url: GLOBAL_URL + "/api/inscrease-priority",
            headers: { authorization: `Bearer ${session?.access_token}` },
            queryParams: { languages: listLanguage },
          });
          if (resPriority.length > 0) {
            console.log(">>> ok rooif");
          } else {
            console.log(">>>khong ra gif");
          }
        }

        console.log(">>> check data content: ", hashtags);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, hashtags]);
  return (
    <Box
      ref={elementRef}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        paddingX: "16px",
        flexWrap: "wrap",
        paddingBottom: "16px",
        "& a": {
          backgroundColor: "#d6e8fa",
          color: "#0c3b6a",
          borderRadius: "4px",
          fontSize: "12px",
          // fontWeight: "400",
          padding: "4.8px 6px",
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
          margin: "0 2px 2px 0",
          border: "1px solid #BDC0C7",
          textDecoration: "none",
          gridArea: "auto",
          "&:hover": {
            transform: "translateY(-1px) translateX(0)",
            boxShadow: "0 1px 0 0 #BDC0C7",
          },
        },
      }}
    >
      {hashtags.map((hashtag) => (
        <Link key={hashtag.id} href={`/hash-tag/${hashtag?.hashtagDetailName}`}>
          {hashtag?.hashtagDetailName}
        </Link>
      ))}
    </Box>
  );
};
export default HashtagPost;
