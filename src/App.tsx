import { app } from './services/firebase.tsx';
import React, { useState, useEffect } from 'react';
import './App.css';
import { Box, Button, Flex, Heading, Image,Textarea} from '@chakra-ui/react'
import { Avatar} from '@chakra-ui/react'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import {getFirestore,collection, doc, setDoc, orderBy, getDocs, query} from 'firebase/firestore'
import { FcGoogle } from "react-icons/fc";
import { CgAttachment } from "react-icons/cg";
import CommentBody from './Components/Comment.tsx';
const auth = getAuth(app);
const  db = getFirestore(app);
const provider = new GoogleAuthProvider();
interface UserProfile {
  displayName: string;
  avatar: string;
  email:string;
  uid:string;
}
interface Comment{
  id: string;
  commentText: string;
  media: string;
  timestamp: Date;
  user: UserProfile;
  reactions?:{};
  replies?:Comment[];
}
function App() {
  const [active,setActive] = useState<boolean>(false);
  const [file,setSelectedFile] = useState<string|null>(null);
  const [activeFeature,setActiveFeature] = useState<string []>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile|null>();
  const [comments,setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');
  function handleTextInputChange(e){
    const value = e.target.value;
    setComment(value);
  }
  function handleClick(str){
    setActiveFeature(prevState => [...prevState, str]);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile: UserProfile = {
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          avatar: user.photoURL ?? '',
          uid: user.uid,
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
        setCurrentUser(userProfile);
      } else {
        console.log("You are logged out");
        setCurrentUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  function handleGoogleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Signed in as:', result.user);
      })
      .catch((error) => {
        console.error('Error signing in:', error);
      });
  }
  function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
     console.log(e.target.files);
     if(e.target.files){
     setSelectedFile(URL.createObjectURL(e.target.files[0]));
     }
  }
  function handleSendButton(){
    if (!comment) {
      return; // Handle empty comment case (optional)
    }
  
    const newComment = {
      // Replace with a unique ID (optional)
      commentText: comment,
      media: file,
      timestamp: new Date().toISOString(),
      user: currentUser
    };
    // Add comment to Firestore
    const commentsCollectionRef = collection(db, "comments"); // Replace with your collection name
    setDoc(doc(commentsCollectionRef), newComment)
      .then(() => {
        console.log("Comment added successfully!",newComment);
        setComment(""); // Clear comment input after sending
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });

  }
  //retrieve data from Firestore
  useEffect(() => {
   async function getComments(){
    const q = query(collection(db, "comments"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    const commentsList: Comment[] = []; // Include ID in type
  
    querySnapshot.forEach((doc) => {
      const commentData= doc.data() as Comment; // Add ID
      const commentWithId:Comment = {...commentData, id:doc.id};
      commentsList.push(commentWithId);
    });
  
    setComments(commentsList);
  }
    // console.log("Comments retrieved successfully!", commentsList);
  getComments();
}
,[]);
  console.log(comments);
  return(
 <Box className='App'>
   {currentUser && ( 
    <Box className='header-section'>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} gap={'5px'}>
   <Avatar name={currentUser.displayName} src={currentUser.avatar} />
   <p>{currentUser.displayName}</p>
   </Box>
   <Button onClick={() => auth.signOut()} _hover={{'backgroundColor':'none'}} backgroundColor={'white'} color={'black'}>Logout</Button>
   </Box>
   )
}
  {!currentUser && (
   <Box display={'flex'} justifyContent={'end'} alignItems={'center'} flexDirection={'row'}>
    <FcGoogle />
     <Button onClick={handleGoogleSignIn} variant='solid' color={'blue'} colorScheme='google'>Sign in with Google</Button>
   </Box>
  )}
  <Box className='main-comment-section'>
   <Flex display={'flex'} direction={'row'} align={'center'} justify={'space-between'}>
   <Heading as={'h3'} size={'lg'}>Comments({comments.length})</Heading>
    <Flex className='sorting-box'>
     <button className={active? 'button_active':'toggle_buttons'} onClick={()=>setActive(!active)}>Latest</button>
     <button className={active? 'toggle_buttons':'button_active'} onClick={()=>setActive(!active)} >Popular</button>
    </Flex>
   </Flex>
   <Box id='input-section'>
  <Textarea className='textarea' value={comment} autoComplete='on' autoFocus={true} maxLength={250} typeof='text'  onChange={handleTextInputChange} />
  <Box className='divider'></Box>
  <Box className='input-footer-section'>
    <Box className='icons'>
    <button onClick = {()=>handleClick('bold')}  >B</button>
    <button onClick={()=>handleClick('italic')}  >I</button>
    <button onClick={()=>handleClick('underline')}>U</button>
    <label htmlFor='input-file'><CgAttachment/></label>
    <input id='input-file' type="file" style={{"display": "none"}} onChange={handleChange}/>
    </Box>
    <Box><button style={{color:"white",backgroundColor:'black',padding:'6px',width:'60px',borderRadius:'5px'}} onClick={handleSendButton}>Send</button></Box>
  </Box>
  {file?
  <Image w={'200px'} h={'200px'} fit={'cover'}  borderRadius={'10px'} src = {file?file:""} border={'1px '}/>
  : ""
}
  </Box>
  {
    comments?.map((comment,index)=>{
        return(
          <CommentBody comment={comment} id = {comment.id}/>
        )
    })
  }
  </Box>
 </Box>
  )  
}

export default App;
