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

    return (
        <div ref={exportRef}>
                        <img
                            src={`http://localhost:3001/assets/${selectedRefPath}`}
                            style={{ objectFit: "contain", width:"100%" }}
                            alt="Select or upload a Reference first..."
                            display="flex"
                            sx={{
                                gridColumn: "span 4",
                            }}
                            />
                        <Draggable>
                        <Box
                            position="absolute"
                            top="1rem"
                            left="12rem"
                            width="fit-content"
                            display="flex"
                            sx={{"&:hover": {border:`1px dashed ${palette.primary.main}`}}}>
                                <Typography
                                    variant="h4"
                                    color="white"
                                    fontWeight="500"
                                        style={{
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            textShadow: '2px 2px black',
                                            cursor: "grab"
                                        }}>
                                        {topCaption}</Typography>
                            </Box>
                        </Draggable>
                        <Draggable>
                        <Box
                            position="absolute"
                            top="12rem"
                            left="12rem"
                            width="fit-content"
                            display="flex"
                            sx={{"&:hover": {border:`1px dashed ${palette.primary.main}`}}}
                            >
                            <Typography
                                variant="h4"
                                color="white"
                                fontWeight="500"
                                        style={{
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            textShadow: '2px 2px black',
                                            cursor: "grab",
                                        }}
                                >{bottomCaption}</Typography>
                            </Box>
                            </Draggable>
                            </div>
    )
};

export default Meme;