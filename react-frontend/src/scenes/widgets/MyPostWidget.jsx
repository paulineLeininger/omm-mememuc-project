import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setRefs } from "state";

const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const refs = useSelector((state) => state.refs);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const light = palette.neutral.light;
    const dark = palette.neutral.dark;

    //for meme display
    const [selectedRefPath, setSelectedRefPath] = useState("");
    const [topCaption, setTopCaption] = useState("");
    const [bottomCaption, setBottomCaption] = useState("");

    const handlePost = async () => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("topText", post);
        formData.append("bottomText", post);

        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
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
        `http://localhost:3001/refs/${_id}/assets/`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        const data = await response.json();
        dispatch(setRefs({ refs: data }));
    };

    useEffect(() => {
        getRefs();

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper>
        <FlexBetween gap="1.5rem">
                <Box
                    display="grid"
                    gap="16px"
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
                    <Box display="flex"
                        gap="0.5rem"
                        borderRadius="5px"
                        mt="0.5rem"
                        p="0.5rem"
                            sx={{
                            overflow: "auto",
                            overflowY: "scroll",
                            gridColumn: "span 6"
                        }}
                    >
                        {console.log("-------getting refs: "+refs.length)}
                        {refs.map((ref) => (
                            <FlexBetween>
                                <Button onClick={() => {
                                    setSelectedRefPath(ref.picturePath);
                                    console.log("selected pic: "+selectedRefPath);
                                }}
                                    width="100px"
                                    height="100px"
                                    alt="ref"
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
                                        "&:hover": { color: light },
                                        "&:selected": {
                                            border: 1, 
                                            borderColor: medium },
                                    }}
                                    />
                            </Button>
                            </FlexBetween>
                        ))}
                    </Box>
                    <Divider sx={{ margin: ".25rem 0", gridColumn: "span 6" }} />
                    <Box
                        display="flex"
                        gap="0.5rem"
                        borderRadius="5px"
                        mt="1rem"
                        p="0.5rem"
                        height="15rem"
                        position="relative"
                        sx={{
                            gridColumn: "span 6"
                        }}> 
                        <img
                            src={`http://localhost:3001/assets/${selectedRefPath}`}
                            style={{ objectFit: "contain", borderRadius: "0%" }}
                            alt="ref"
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                gridColumn: "span 6",
                            }}
                        />
                        <Box
                            position="absolute"
                            top={-80}
                            left={0}
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Typography
                            variant="h4"
                                color="white"
                                fontWeight="500"
                                style={{ textTransform: 'uppercase', fontWeight: 'bold', textShadow: '2px 2px black' }}>
                                Top Caption</Typography>
                        </Box>
                        <Box
                            position="absolute"
                            top={80}
                            left={0}
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Typography
                                variant="h4"
                                color="white"
                                fontWeight="500"
                                style={{ textTransform: 'uppercase', fontWeight: 'bold', textShadow: '2px 2px black'}}
                            >Bottom Caption</Typography>
                        </Box>
                    </Box>
                    <InputBase
                        placeholder="Top Caption"
                        onChange={(e) => (topCaption=(e.target.value))}
                        value={topCaption}
                        sx={{
                            width: "100%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "2rem",
                            padding: "1rem",
                            gridColumn: "span 3",
                        }}
                    />
                    <InputBase
                        placeholder="Bottom Caption"
                        onChange={(e) => bottomCaption=(e.target.value)}
                        value={bottomCaption}
                        sx={{
                            width: "100%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "2rem",
                            padding: "1rem",
                            gridColumn: "span 3",
                        }}
                    />
                    <UserImage image={picturePath} sx={{ gridColumn: "span 1" }}/>
                    <InputBase
                        placeholder="Leave a comment..."
                        onChange={(e) => setPost(e.target.value)}
                        value={post}
                        sx={{
                            width: "100%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "2rem",
                            padding: "1rem 2rem",
                            gridColumn: "span 5",
                        }}
                    />
                </Box>
        </FlexBetween>
        {isImage && (
            <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                mt="1rem"
                p="1rem"
                >
            <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
                {({ getRootProps, getInputProps }) => (
                    <FlexBetween>
                        <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            width="100%"
                            sx={{ "&:hover": { cursor: "pointer" } }}
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

        <Divider sx={{ margin: "1.25rem 0" }} />

        <FlexBetween>
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
                <FlexBetween gap="0.25rem">
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Clip</Typography>
                </FlexBetween>

                <FlexBetween gap="0.25rem">
                <AttachFileOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Attachment</Typography>
                </FlexBetween>

                <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Audio</Typography>
                </FlexBetween>
            </>
            ) : (
            <FlexBetween gap="0.25rem">
                <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
            )}

            <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
            }}
            >
            POST
            </Button>
        </FlexBetween>
        </WidgetWrapper>
    );
};

export default MyPostWidget;
