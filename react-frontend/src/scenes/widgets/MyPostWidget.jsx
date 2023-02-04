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
import exportAsImage from "helpers/exportAsImage"
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
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
import { setPosts, setRefs, setImgs } from "state";
import Meme from "components/Meme";

const MyPostWidget = ({ picturePath }) => {
    //for post
    const dispatch = useDispatch();

    //state hooks
    const [isImage, setIsImage] = useState(false);
    const [isGif, setIsGif] = useState(false);
    const [image, setImage] = useState(null);
    const [gif, setGif] = useState(null);
    const [desc, setDesc] = useState("");
    const { palette } = useTheme();

    //state
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const refs = useSelector((state) => state.refs);
    const imgs = useSelector((state) => state.imgs);
    const posts = useSelector((state) => state.posts);
    const buttonRefs = useRef([]);

    //test
    //const [isTest, setIsTest] = useState(false);

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
    const HISTORY = "history";
    const DRAFT = "draft";

    //for meme display
    const [selectedRefPath, setSelectedRefPath] = useState("");
    const [refPaths, setRefPaths] = useState([]);
    const [refMode, setRefMode] = useState(REFERENCE);
    const [selectedRefIndex, setSelectedRefIndex] = useState(0);
    const [maxRefIndex, setMaxRefIndex] = useState(0);
    const [topCaption, setTopCaption] = useState("");
    const [bottomCaption, setBottomCaption] = useState("");

    //download
    const exportRef = useRef();

    const handlePost = async () => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("topCaption", topCaption);
        formData.append("bottomCaption", bottomCaption);

        if (selectedRefPath !== "") {
            formData.append("picturePath", selectedRefPath);
        }
        if (desc !== "") {
            formData.append("description", desc);
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
        setDesc("");
    };

    const handleRef = async() => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("topCaption", topCaption);
        formData.append("bottomCaption", bottomCaption);

        if (selectedRefPath !== "") {
            formData.append("picturePath", selectedRefPath);
        }
        if (image) {
            formData.append("picture", image);
        }
        const response = await fetch(`http://localhost:3001/refs`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const refs = await response.json();
        dispatch(setRefs({ refs }));
        setImage(null);
    }

    const getRefs = async () => {
        const response = await fetch(
        `http://localhost:3001/refs`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        const data = await response.json();
        dispatch(setRefs({ refs: data }));
    };

    const getImgs = async () => {
        const response = await fetch(
        `http://localhost:3001/imgs`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        const data = await response.json();
        dispatch(setImgs({ imgs: data }));
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
        getImgs();
        console.log("imgs: " + imgs.length);
        console.log("refs: " + refs.length);
        getUserPosts();
        setMaxRefIndex(refs.length - 1);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    //reference Mode changed
    useEffect(() => {
        switch (refMode) {
            case REFERENCE: setRefPaths(imgs.map(element => element.picturePath)); break;
            case HISTORY: setRefPaths(imgs.map(element => element.picturePath)); break;
            case DRAFT: setRefPaths(imgs.map(element => element.picturePath)); break;
            case TEMPLATE: setRefPaths(refs.map(element => element.picturePath)); break;
            default: setRefPaths(imgs.map(element => element.picturePath)); break;
        } 
    }, [refMode]); // eslint-disable-line react-hooks/exhaustive-deps

    //refs changed
    useEffect(() => {
    if (refs.length > 0 && refMode===TEMPLATE) {
        setRefPaths(refs.map(element => element.picturePath));
        //console.log("refpaths " + refPaths.length);
        //console.log("maxIndex: " + maxRefIndex);
    }
    }, [refs]);

    //imgs changed
    useEffect(() => {
    if (imgs.length > 0 && refMode===REFERENCE) {
        setRefPaths(imgs.map(element => element.picturePath));
        console.log("imgpaths " + refPaths.length);
        console.log("maxIndex: " + maxRefIndex);
    }
    }, [imgs]);

    //selectedRefPath changed
    useEffect(() => {
        if (buttonRefs !== null && buttonRefs.length>0) {
            if (selectedRefPath !== "") {
                buttonRefs.current[selectedRefIndex].focus();
            }
            else {
                buttonRefs.current[0].focus();
            }
        }
        console.log("selected ref path: " + selectedRefPath); 
    }, [selectedRefPath]);

    //selectedRefIndex changed
    useEffect(() => {
        setSelectedRefPath(refPaths[selectedRefIndex]);
        console.log("selected ref index: " + selectedRefIndex);
    }, [selectedRefIndex]);

    const MemeSelection = (input_imgs) => {
        return (
            <Box display="flex"
                borderRadius="5px"
                p="0.5rem"
                sx={{
                    overflow: "auto",
                    overflowY: "scroll",
                    gridColumn: "span 6"
                }}
            >
                {input_imgs.map((img, index) => (
                    <FlexBetween>
                        <Button
                            ref={(el) => (buttonRefs.current[index] = el)}
                            onClick={() => {
                                setSelectedRefPath(img.picturePath);
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
                                src={`http://localhost:3001/assets/${img.picturePath}`}
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
            </Box>
        )
    };

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
                                width: "20%",
                                gridColumn: "span 6",
                            }}
                            onClick={() => {
                                setRefMode(REFERENCE);
                                setMaxRefIndex(refs.length - 1);
                            }}>
                            All Images</ToggleButton>
                        <ToggleButton value={HISTORY} sx={{
                            width: "20%",
                            gridColumn: "span 6",
                        }} onClick={() => {
                            setRefMode(HISTORY);
                            setMaxRefIndex(refs.length - 1);
                            }} >History</ToggleButton>
                        <ToggleButton value={DRAFT} sx={{
                            width: "20%",
                            gridColumn: "span 6",
                        }} onClick={() => {
                            setRefMode(DRAFT);
                            setMaxRefIndex(refs.length - 1);
                        }} >Drafts</ToggleButton>
                        <ToggleButton value={TEMPLATE} sx={{
                            width: "20%",
                            gridColumn: "span 6",
                        }} onClick={() => {
                            setRefMode(TEMPLATE);
                            setMaxRefIndex(refs.length - 1);
                        }} >Templates</ToggleButton>
                        <ToggleButton value={UPLOAD} sx={{
                            width: "20%",
                            gridColumn: "span 6",
                        }}onClick={() => setRefMode(UPLOAD)}>Upload owm image</ToggleButton>
                    </ToggleButtonGroup>

                    {refMode === REFERENCE && (
                    
                        <>{MemeSelection(imgs)}</>
                        
                    )
                    }
                    {refMode === TEMPLATE && (
                        <>{MemeSelection(refs)}</>
                    )
                    }
                    {refMode === DRAFT && (
                        <>{MemeSelection(posts)}</>
                        )
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
                                    sx={{ "&:hover": { cursor: "pointer" }}}
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
                        position="relative"
                        style={{ objectFit: "contain", width:"100%" }}
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
                        <Meme exportRef={exportRef}
                            selectedRefPath={selectedRefPath}
                            topCaption={topCaption}
                            bottomCaption={bottomCaption}
                            topCaptionX={0}
                            bottomCaptionX={0}
                            topCaptionY={0}
                            bottomCaptionY={0}
                            font={""}
                            fontSize={""}
                            fontColor={""}
                            fontBackground={""}
                            canvasHeight={0}
                            canvasWidth={0}
                        />
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
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
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
                        disabled={!desc}
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
            <Button onClick={() => exportAsImage(exportRef.current, "test")}>Download</Button>
        </WidgetWrapper>
    );
};

export default MyPostWidget;

