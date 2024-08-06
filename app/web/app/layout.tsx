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
import { ReactNode } from "react";
import type { Metadata } from "next";
import AuthProvider from "@/providers/AuthProvider";
import './index.css';

type RootLayoutProps = {
   children: ReactNode;
}

export const metadata: Metadata = {
   title: "sofia-message-web",
   description: "home page, homescreen sofia-message-web",
};


export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
   return (
      <html lang="en">
         <body>
            <AuthProvider>
               {children}
            </AuthProvider>
         </body>
      </html>
   );
}