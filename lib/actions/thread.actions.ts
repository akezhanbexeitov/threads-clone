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

export const fetchThreads = async (pageNumber = 1, pageSize = 20) => {
    await connectToDB()

    try {
        // Calculate the number of threads to skip
        const skipAmount = (pageNumber - 1) * pageSize

        const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: 'User' })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: '_id name parentId image'
                }
            })
        
        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

        const threads = await threadsQuery.exec()

        const isNext = totalPostsCount > skipAmount + threads.length

        return { threads, isNext }
    } catch (error: any) {
        throw new Error(`Error fetching threads: ${error.message}`)
    }
}

export const fetchThreadById = async (id: string) => {
    await connectToDB()

    try {
        // TODO populate community
        const threadQuery = Thread.findById(id)
            .populate({
                path: 'author',
                model: 'User',
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: 'User',
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: 'Thread',
                        populate: {
                            path: 'author',
                            model: 'User',
                            select: '_id id name parentId image'
                        }
                    }
                ]
            })
        
        const thread = await threadQuery.exec()
        return thread
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}
