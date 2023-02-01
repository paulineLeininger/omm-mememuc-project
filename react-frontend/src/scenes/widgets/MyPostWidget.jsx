import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
    Select,
    MenuItem
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setRefs } from "state";

const MyPostWidget = ({ picturePath }) => {
    //for post
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [isGif, setIsGif] = useState(false);
    const [image, setImage] = useState(null);
    const [gif, setGif] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();

    //state
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const refs = useSelector((state) => state.refs);
    const posts = useSelector((state) => state.posts);
    const buttonRefs = useRef([]);


    //gui
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const lightMain = palette.neutral.lightMain;
    const darkMain = palette.neutral.darkMain;
    const medium = palette.neutral.medium;
    const light = palette.neutral.light;
    const REFERENCE = "reference";
    const TEMPLATE = "template";
    const UPLOAD = "upload";

    //for meme display
    const [selectedRefPath, setSelectedRefPath] = useState("");
    const [refPaths, setRefPaths] = useState([]);
    const [refMode, setRefMode] = useState(REFERENCE);
    const [selectedRefIndex, setSelectedRefIndex] = useState(0);
    const [maxRefIndex, setMaxRefIndex] = useState(0);
    const [topCaption, setTopCaption] = useState("");
    const [bottomCaption, setBottomCaption] = useState("");

    const handlePost = async () => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("topCaption", topCaption);
        formData.append("bottomCaption", bottomCaption);

        if (selectedRefPath !== "") {
            formData.append("picturePath", selectedRefPath);
        }
        if (post !== "") {
            formData.append("description", post);
        }
        if (image) {
            formData.append("picture", image);
        }

        const response = await fetch(`http://localhost:3001/posts`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("");
    };

    const getRefs = async () => {
        const response = await fetch(
        `http://localhost:3001/refs/${_id}/refs`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        const data = await response.json();
        dispatch(setRefs({ refs: data }));
    };
    const getUserPosts = async () => {
        const response = await fetch(
        `http://localhost:3001/posts/${_id}/posts`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    };

    useEffect(() => {
        getRefs();
        getUserPosts();
        setMaxRefIndex(refs.length - 1);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
    if (refs.length > 0) {
        setRefPaths(refs.map(element => element.picturePath));
        console.log("refpaths " + refPaths.length);
        console.log("maxIndex: " + maxRefIndex);
  }
}, [refs]);

    useEffect(() => {
        if (selectedRefPath !== "") {
            /* const index = buttonRefs.current.findIndex(
             (ref) => ref.picturePath === selectedRefPath
             );
             if (index !== -1) {
             buttonRefs.current[index].focus();
             }*/
            buttonRefs.current[selectedRefIndex].focus();
        }
        else {
            buttonRefs.current[0].focus();
        }
        console.log("selected ref path: " + selectedRefPath); 
    }, [selectedRefPath]);

    useEffect(() => {
        setSelectedRefPath(refPaths[selectedRefIndex]);
        console.log("selected ref index: " + selectedRefIndex);
    }, [selectedRefIndex]);

    return (
        <WidgetWrapper>
        <FlexBetween gap="1.5rem">
                <Box
                    display="grid"
                    gap="6px"
                    width="100%"
                    gridTemplateColumns="repeat(6, minmax(0, 1fr))">
                    <Typography
                        variant="h4"
                        color={palette.neutral.dark}
                        fontWeight="500"
                        sx={{
                            gridColumn: "span 6"
                        }}
                    >Create your own Meme
                    </Typography>
                    <ToggleButtonGroup
                        value={refMode}
                        display="flex"
                        sx={{
                            width: "100%",
                            gridColumn: "span 6",
                            borderRadius: "0.5rem",
                            p: "0.25rem 0rem",
                        }}
                        >
                        <ToggleButton 
                            value={REFERENCE}
                            sx={{
                                width: "33%",
                                gridColumn: "span 6",
                            }}
                            onClick={() => {
                                setRefMode(REFERENCE);
                                setMaxRefIndex(refs.length - 1);
                            }}>
                            Reference Images</ToggleButton>
                        <ToggleButton value={TEMPLATE} sx={{
                            width: "33%",
                            gridColumn: "span 6",
                        }} onClick={() => {
                            setRefMode(TEMPLATE);
                            setMaxRefIndex(refs.length - 1);
                        }} >Templates</ToggleButton>
                        <ToggleButton value={UPLOAD} sx={{
                            width: "33%",
                            gridColumn: "span 6",
                        }}onClick={() => setRefMode(UPLOAD)}>Upload owm image</ToggleButton>
                    </ToggleButtonGroup>

                    {refMode===REFERENCE && (
                        <Box display="flex"
                            //gap="0.5rem"
                            borderRadius="5px"
                            p="0.5rem"
                                sx={{
                                    overflow: "auto",
                                    overflowY: "scroll",
                                    gridColumn: "span 6"
                            }}
                        >
                            {refs.map((ref, index) => (
                                <FlexBetween>
                                    <Button
                                        ref={(el) => (buttonRefs.current[index] = el)}
                                        onClick={() => {
                                            setSelectedRefPath(ref.picturePath);
                                            console.log("CLICK Should: set path to '" + ref.picturePath + "' and index to " + index);
                                            //console.log("CLICK Does: set path to '" + selectedRefPath + "' and index to " + selectedRefIndex);
                                            setSelectedRefIndex(index);
                                    }}
                                        width="100px"
                                        height="100px"
                                        alt="ref"
                                        sx={{
                                            "color": medium,
                                            "&:focus": {
                                                border: 1,
                                                borderColor: palette.primary.dark
                                            }
                                        }}
                                        p="1rem"
                                >
                                    <img
                                        src={`http://localhost:3001/assets/${ref.picturePath}`}
                                        style={{ objectFit: "cover", borderRadius: "3%" }}
                                        width="100px"
                                        height="100px"
                                        alt="ref"
                                        p="1rem"
                                        sx={{
                                            "&:hover": { color: light, border: 1, 
                                                borderColor: medium },
                                            "&:selected": {
                                                border: 1, 
                                                borderColor: medium },
                                        }}
                                        />
                                </Button>
                                </FlexBetween>
                            ))
                        }
                        </Box>)
                    }
                    {refMode===TEMPLATE && (
                        <Box display="flex"
                            borderRadius="5px"
                            p="0.5rem"
                                sx={{
                                    overflow: "auto",
                                    overflowY: "scroll",
                                    gridColumn: "span 6"
                            }}
                        >
                            
                            {posts.map((post, index) => (
                                (post.picturePath !=="") &&  (post.picturePath !==null) &&
                                <FlexBetween>
                                    <Button
                                        //ref={(el) => (buttonRefs.current[index] = el)}
                                        onClick={() => {
                                            if (selectedRefPath !== null && selectedRefPath !== "") { 
                                                //setSelectedRefPath(post.picturePath);
                                                //setSelectedRefIndex(index);

                                        }
                                    }}
                                        width="100px"
                                        height="100px"
                                        alt="ref"
                                        sx={{
                                            "color": medium,
                                            "&:focus": {
                                                border: 1,
                                                borderColor: palette.primary.dark
                                            }
                                        }}
                                        p="1rem"
                                    >
                                        <img
                                            src={`http://localhost:3001/assets/${post.picturePath}`}
                                            style={{ objectFit: "cover", borderRadius: "3%" }}
                                            width="100px"
                                            height="100px"
                                            alt="ref"
                                            p="1rem"
                                            sx={{
                                                "&:hover": {
                                                    color: light, border: 1,
                                                    borderColor: medium
                                                },
                                                "&:selected": {
                                                    border: 1,
                                                    borderColor: medium
                                                },
                                            }}
                                        />
                                    </Button>
                                </FlexBetween>
                            ))
                        }
                        </Box>)
                    }
                    {refMode === UPLOAD && (
                    <Box
                        border={`1px solid ${medium}`}
                        borderRadius="5px"
                        mt="1rem"
                        p="1rem"
                        display="flex"
                        width="100%"
                        sx={{
                            gridColumn: "span 6"
                        }}
                        >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png,"
                        multiple={false}
                        display="flex"
                        width="100%"
                        sx={{
                            gridColumn: "span 6"
                        }}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    display="flex"
                                    sx={{ "&:hover": { cursor: "pointer" } , gridColumn: "span 6" }}
                                    >
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p>Add Image Here</p>
                                    ) : (
                                        <FlexBetween>
                                        <Typography>{image.name}</Typography>
                                        <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
                    )}
                    <Box
                        display="flex"
                        gap="2rem"
                        borderRadius="5px"
                        mt="1rem"
                        p="0.5rem"
                        height = "20rem"
                        position="relative"
                        sx={{
                            gridColumn: "span 6"
                        }}>
                        {(selectedRefIndex < 1) && (
                            <ArrowBackIosIcon disabled sx={{ color: light, gridColumn: "span 1" }} />
                        )}
                        {(selectedRefIndex >= 1) && (
                            <ArrowBackIosIcon onClick={() => {
                                console.log("sel ref i: " + selectedRefIndex);
                                setSelectedRefIndex(selectedRefIndex - 1);
                            }} sx = {{ color: medium, gridColumn: "span 1" }} />
                        )}
                        <img
                            src={`http://localhost:3001/assets/${selectedRefPath}`}
                            style={{ objectFit: "contain", borderRadius: "0%" }}
                            alt="Select or upload a Reference first..."
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                gridColumn: "span 4",
                            }}
                        />
                        <Box
                            position="absolute"
                            top="2rem"
                            left="15rem"
                            width="20%"
                            height="10%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Typography
                            variant="h4"
                                color="white"
                                fontWeight="500"
                                style={{ textTransform: 'uppercase', fontWeight: 'bold', textShadow: '2px 2px black' }}>
                                {topCaption}</Typography>
                        </Box>
                        <Box
                            position="absolute"
                            top="17rem"
                            left="15rem"
                            width="20%"
                            height="10%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Typography
                                variant="h4"
                                color="white"
                                fontWeight="500"
                                style={{ textTransform: 'uppercase', fontWeight: 'bold', textShadow: '2px 2px black'}}
                            >{bottomCaption}</Typography>
                        </Box>
                        {(selectedRefIndex === maxRefIndex) && (
                            <ArrowForwardIosIcon disabled sx={{ color: light, gridColumn: "span 1" }} />
                        )}
                        {(selectedRefIndex >= 0) && (selectedRefIndex < maxRefIndex) && (
                            <ArrowForwardIosIcon onClick={() => {
                                    console.log("sel ref i: " + selectedRefIndex);
                                    setSelectedRefIndex(selectedRefIndex + 1);
                            }}  sx={{ color: mediumMain, gridColumn: "span 1" }
                        } />
                        )}
                    </Box>
                    <InputBase
                        placeholder="Top Caption"
                        onChange={(e) => (setTopCaption(e.target.value))}
                        sx={{
                            width: "100%",
                            height: "70%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            gridColumn: "span 3",
                        }}
                    />
                    <InputBase
                        placeholder="Bottom Caption"
                        onChange={(e) =>
                            (setBottomCaption(e.target.value)
                            )}
                        sx={{
                            width: "100%",
                            height: "70%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            gridColumn: "span 3",
                        }}
                    />
                    <Divider sx={{ margin: "0.25rem 0", gridColumn: "span 6"  }} />
                    <UserImage gap="2rem" mr="1rem" image={picturePath} sx={{ gridColumn: "span 1" }}/>
                    <InputBase
                        placeholder="Leave a comment..."
                        onChange={(e) => setPost(e.target.value)}
                        value={post}
                        ml="3rem"
                        sx={{
                            width: "100%",
                            height: "70%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            gridColumn: "span 4",
                        }}
                    />
                    <Button
                        disabled={!post}
                        onClick={handlePost}
                        sx={{
                            width: "100%",
                            height: "70%",
                            color: palette.background.alt,
                            backgroundColor: palette.primary.main,
                            borderRadius: "0.5em",
                            gridColumn: "span 1"
                        }}
                    >
                        POST
                    </Button>
                </Box>
        </FlexBetween>
         {/*<FlexBetween>
           <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
                Image
            </Typography>
            </FlexBetween>

            {isNonMobileScreens ? (
            <>
                <FlexBetween gap="0.25rem" onClick={() => setIsGif(!isGif)}>
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography
                    color={mediumMain}
                    sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
                    Clip
                </Typography>
                </FlexBetween>
            </>
            ) : (
            <FlexBetween gap="0.25rem">
                <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
            )}

        </FlexBetween>*/}
        </WidgetWrapper>
    );
};

export default MyPostWidget;
