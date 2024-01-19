"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"

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
    try {
        connectToDB() 

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name: name.trim(),
                image,
                bio: bio.trim(),
                onboarded: true,
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

export const fetchUser = async (userId: string) => {
    try {
        connectToDB()

        return await User
            .findOne({ id: userId })
            // .populate({
            //     path: 'communities',
            //     model: Community
            // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export const fetchUserThreads = async (userId: string) => {
    try {
        await connectToDB()

        // TODO populate community
        const threads = await User.findOne({ id: userId })
            .populate({
                path: "threads",
                model: Thread,
                populate: {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "name image id", 
                    },
                },
            });
        
        return threads
    } catch (error: any) {
        throw new Error(`Failed to fetch user threads: ${error.message}`)
    }
}

interface IFetchUsersParams {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}

export const fetchUsers = async ({
    userId,
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}: IFetchUsersParams) => {
    try {
        await connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize
        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUsersCount > skipAmount * users.length

        return { users, isNext }
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}
