/**
 * @license
 * Copyright 2024 Birusha Ndegeya, sofia and Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Link from "next/link";

export default function ChatHeader({
   avatarURL = "",
   userName,
   userId,
   typing = ""
}:{
   avatarURL?: string,
   userName: string,
   userId?: string,
   typing?: string;
}) {
   return (
      <header className="bg-white p-4 text-gray-700 flex justify-between border-b border-gray-200 w-full">
         <div>
            <h1 className="text-xl font-semibold">{userName}</h1>
            <p className="text-sm italic">{typing}</p>
         </div>
         <Link href={`/chats/profile/${userId}`}>
            <div className={`w-10 h-10 rounded-full bg-blue-400 text-gray-50 overflow-hidden hover:cursor-pointer`}>
               {avatarURL ? (
                  <img
                     src={avatarURL}
                     alt="Avatar"
                     className={`w-10 h-10`}
                  />
               ) : (
                  <span className="text-2xl font-semibold flex items-center justify-center w-full h-full">
                     {userName.charAt(0)}
                  </span>
               )}
            </div>
         </Link>
      </header>
   );
}