"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface IParams {
    text: string
    author: string
    communityId: string | null
    path: string
}

export const createThread = async ({
    text,
    author,
    communityId,
    path
}: IParams) => {
    try {
        connectToDB()

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        })

        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)
    }
}
