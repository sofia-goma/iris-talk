"use client";
import { useState, useEffect, useContext } from "react";
import ChatHeader from "@/components/layouts/ChatHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import UserMessage from "@/components/ui/UserMessage";
import { sendMessage } from "@/utils/messageAPI";
import { AuthContext } from "@/contexts/authContext";
import { AiFillWechat, } from 'react-icons/ai';
import socket from "@/config/socket.io.config";
import axiosInstance from "@/config/axios.config";


type Inputs = {
   messageContent: string;
}

export default function ChatByUser({ params }: {
   params: {
      chatId: string;
   }
}) {

   const { userId } = useContext(AuthContext);
   const [senderName, setSenderName] = useState('');
   const [messageList, setMessageList] = useState<any>([]);
   const { register, handleSubmit, reset } = useForm<Inputs>();

   /**
    * socket io client
    */

   useEffect(() => {
      socket.on('receiveMessage', (message) => {
         setMessageList((prevMessages: any) => [...prevMessages, message]);
      });

      return () => {
         socket.off('receiveMessage');
      };
      // console.log('some connection');
   }, []);

   /**
    * load the sender Name from the server
    */

   useEffect(() => {
      const loadSenderUser = async () => {
         try {
            const currentUserData = await axiosInstance.get(`/api/users/${params.chatId}`);
            const result = await currentUserData;
            setSenderName(await result.data.userName);
         } catch (err) {
            console.log('Failed to fetch users');
         }
      }
      loadSenderUser()
   }, []);

   /**
    * load the all the discussion messages
    */

   useEffect(() => {
      if (typeof window !== 'undefined') {
         const fetchMessages = async () => {
            const currentUserId = localStorage.getItem('currentUserId');
            try {
               const resp = await axiosInstance.get(`/api/chats/${currentUserId || userId}/${params.chatId}`);
               const result = await resp.data;
               setMessageList(await result);
            } catch (err) {
               console.log('Failed to fetch users');
            }
         }
         fetchMessages();
      }
   }, [messageList]);

   // send messages to the user 
   const onSubmit: SubmitHandler<Inputs> = async (d) => {
      try {
         const { messageContent } = d;
         if (typeof window !== 'undefined') {
            const currentUserId = localStorage.getItem('currentUserId');
            const resp = await sendMessage(currentUserId || userId, params.chatId, messageContent);
            const result = await resp;
            setMessageList((prevMessageList: any) => [...prevMessageList, result]);
            socket.emit('sendMessage', messageContent);
            // socket.emit('sendMessage', result);
            // socket.on('receivedMessage', function (data) {
            //    setMessageList((prevMessageList: any) => [...prevMessageList, data]);
            // });
            reset();
         }
      } catch (e) {
         console.warn(e);
      }
   }

   return (
      <div className="flex-1">
         {/* <!-- Chat Header --> */}
         <ChatHeader
            userName={senderName}
            userId={params.chatId}
         />
         {/* <!-- Chat Messages --> */}
         <div className="h-screen overflow-y-auto p-4 pb-36">
            {
               messageList.length == 0 || !messageList ? (
                  <div className="mt-4 flex flex-col items-center justify-center">
                     <h1 className="mb-5 text-lg font-normal text-gray-500 text-center">Say Hello to {senderName}</h1>
                     <AiFillWechat
                        size={64}
                        className="fill-blue-300"
                     />
                  </div>
               ) : (
                  messageList?.map((message: any) => (
                     <UserMessage
                        key={message.messageId}
                        messageContent={message.messageContent}
                        time={message.created}
                        currentId={localStorage.getItem('currentUserId') || userId}
                        currentUserId={message.senderId}
                        // senderName={message.sender.userName}
                     />
                  ))
               )
            }
         </div>

         {/* <!-- Chat Input --> */}
         {/* w-3/4 default width */}
         <div className="bg-white border-t border-gray-300 p-4 absolute bottom-0 md:w-2/4 lg:w-2/3">
            <form
               onSubmit={handleSubmit(onSubmit)} className="flex items-center"
            >
               <input
                  type="text"
                  placeholder="Type a message..."
                  {...register('messageContent', { required: true, })}
                  className="w-full p-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#8098F9]"
               />
               <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-gray-50 px-4 py-2 rounded-md ml-2">Send</button>
            </form>
         </div>
      </div>
   );
}