// "use client"

// import { useParams } from "next/navigation";
// // import { useSession, signIn, signOut } from "next-auth/react";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import NextWrapper from "@/lib/next.wrapper";
// import { getServerSession } from "next-auth";

// const ProductDetailPage = async () => {

//     const session: User | null = await getServerSession(authOptions);

//     const params = useParams<{ hashTagText: string }>();

//     if (session) {

//         return <NextWrapper user={session} hashTagText={params.hashTagText} />;
//     }else{
//         return "loading....";
//     }



// };



// export default ProductDetailPage;

'use client'
import PostProfile from "@/components/profile/post.profile";
import { Box } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useParams } from "next/navigation";
import { useState } from "react";



const DetailHashTag = () => {
    const params = useParams<{ hashTagText: string }>();
    const [listPost, setListPost] = useState();


    console.log("check hashtag: ", params.hashTagText);
    return (<Box>
        <Box>
            {params.hashTagText}
        </Box>
        <Divider>

        </Divider>
        <PostProfile hashTagText={params.hashTagText} />
    </Box>)
};

export default DetailHashTag;

