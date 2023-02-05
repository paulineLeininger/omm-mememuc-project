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
import Draggable from 'react-draggable'; 

const Meme = ({
    exportRef,
    selectedRefPath,
    topCaption,
    bottomCaption,
    topCaptionX,
    topCaptionY,
    bottomCaptionX,
    bottomCaptionY,
    font,
    fontSize,
    fontColor,
    fontBackground,
    canvasHeight,
    canvasWidth,
}) => {
    
    const { palette } = useTheme();
    const [outline, setOutline] = useState("white");

    useEffect(() => {
        if (fontColor === "white" || fontColor === "yellow") {
            setOutline("black");
        }
        else {
            setOutline("grey");
        }
    }, [fontColor]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div ref={exportRef} style={{ objectFit: "contain",display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={`http://localhost:3001/assets/${selectedRefPath}`}
                            style={{ objectFit: "contain", width:"100%", margin: 'auto' }}
                            alt="Select or upload a Reference first..."
                            sx={{
                                gridColumn: "span 4",
                            }}
                            />
                        <Draggable>
                        <Box
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            position="absolute"
                            top="10%"
                            width="fit-content"
                            display="flex"
                            sx={{ "&:hover": { border: `1px dashed ${palette.primary.main}` } }}>

                            <Typography
                                variant="h4"
                                color={fontColor}
                                fontWeight="500"
                                style={{
                                    fontFamily: font,
                                    fontSize: fontSize/2+"rem",
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    textShadow: '2px 2px '+outline,
                                    cursor: "grab"
                                }}
                                >
                                    {topCaption}</Typography>
                            </Box>
                        </Draggable>
                        <Draggable>
                        <Box  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            position="absolute"
                            top="80%"
                            width="fit-content"
                            display="flex"
                            sx={{"&:hover": {border:`1px dashed ${palette.primary.main}`}}}
                            >
                            <Typography
                                variant="h4"
                                color={fontColor}
                                fontWeight="500"
                        style={{
                                    fontSize: fontSize/2+"rem",
                                    fontFamily: font,
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    textShadow: '2px 2px '+outline,
                                    cursor: "grab",
                                        }}
                                >{bottomCaption}</Typography>
                            </Box>
                            </Draggable>
                            </div>
    )
};

export default Meme;