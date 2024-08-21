import { Avatar, Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useState, MouseEvent } from 'react';
import Picker, { EmojiClickData } from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app }  from '../services/firebase.tsx';
const db = getFirestore(app);
const EmojiPicker = ({ onEmojiClick }) => {
    return (
        <>
            <Picker onEmojiClick={onEmojiClick} />
        </>
    );
};

const CommentBody = ({ id, comment }) => {
    const [showPicker, setPicker] = useState<Boolean>(false);
    const [reactions,setReaction] = useState(comment.reactions||{});

    function handleReaction(event: MouseEvent, emojiData: EmojiClickData): void {
        const emoji = emojiData.emoji;
        const updatedReactions = {...reactions,[emoji]:(reactions[emoji]||0)+1};
        setReaction(updatedReactions);
        const commentRef = doc(db,'comments',id)
    }

    return (
        <Box display={'flex'} flexDirection={'row'} mt={10}>
            <Box borderRight={2} borderColor={'gray'}></Box>
            <Box display={'flex'} gap={12} flexDirection={'column'} mb={4}>
                <Flex align={'center'} direction={'row'} gap={2}>
                    <Avatar name={comment.user.displayName} src={comment.user.avatar} />
                    <Text as={'h4'}>{comment.user.displayName}</Text>
                </Flex>
                <Text fontSize={'20px'}>{comment.commentText}</Text>
                {comment.media ? (
                    <Image w={'200px'} h={'200px'} borderRadius={'5px'} src={comment.media} />
                ) : null}
                <Box display={'flex'} flexDirection={'row'} gap={5}>
                    <button onClick={() => setPicker(!showPicker)}><MdOutlineEmojiEmotions /></button>
                    {showPicker && <EmojiPicker onEmojiClick={(emojiData, event) => handleReaction(event, emojiData)} />}
                    <Button>Reply</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CommentBody;
