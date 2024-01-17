"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface IParams {
    userId: string,
    username: string,
    name: string,
    image: string,
    bio: string,
    path: string
}

export const updateUser = async ({
    userId,
    username,
    name,
    image,
    bio,
    path
}: IParams): Promise<void> => {
    connectToDB() 
    
    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name: name.trim(),
                image,
                bio: bio.trim(),
                path
            },
            { upsert: true }
        )

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) { 
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}