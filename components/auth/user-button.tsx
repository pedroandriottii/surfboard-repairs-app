"use client";

import { FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { ExitIcon } from "@radix-ui/react-icons"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/logout-button";
import { SettingsButton } from "@/components/auth/settings-button";

export const UserButton = () => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    {/* <AvatarImage src={user?.image || ""} /> */}
                    <AvatarFallback className="bg-realce">
                        <FaUser className="text-black" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {/* <SettingsButton>
                    <DropdownMenuItem>
                        <IoSettingsOutline className="h-4 w-4 mr-2" />
                        Configurações
                    </DropdownMenuItem>
                </SettingsButton> */}
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="h-4 w-4 mr-2" />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}