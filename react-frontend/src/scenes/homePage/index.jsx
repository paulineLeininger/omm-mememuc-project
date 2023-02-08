import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import UserWidget from "scenes/widgets/UserWidget";
import MemeEditorWidget from "scenes/widgets/MemeEditorWidget";
import PostsWidget from "scenes/widgets/MemeFeedWidget";
import NavBar from "scenes/navBar";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);

    return (
        <Box>
        <NavBar />
        
        <Box
            width="100%"
            padding="2rem 6%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="0.5rem"
            justifyContent="space-between"
        >
            <Box flexBasis={isNonMobileScreens ? "20%" : undefined}>
                <UserWidget userId={_id} picturePath={picturePath} />
                <Box padding="2rem 0rem">
                    <FriendListWidget userId={_id}/>
                </Box>
            </Box>
            
            <Box flexBasis={isNonMobileScreens ? "58%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"} >
                <MemeEditorWidget picturePath={picturePath} />
            </Box>
                
                <Box flexBasis={isNonMobileScreens ? "20%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
                <PostsWidget userId={_id} />
            </Box>
        </Box>
        </Box>
    );
};

export default HomePage;
