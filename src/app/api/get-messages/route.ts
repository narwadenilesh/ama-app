import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    // const user : User = session?.user
    const user = session?.user as User & { _id: string };
    if (!user?._id) {
        return Response.json({
            success: false,
            message: "User ID missing in session"
        }, { status: 400 });
    }
    if(!session || !session?.user){
        return Response.json({
            success : false,
            message : "Not authonticated"
        }, {status : 401});
    } 
    console.log("Session User:", session.user);
    console.log("User ID:", user._id);  
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {
                $unwind: {
                path: "$messages",
                preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                _id: "$_id",
                messages: { $push: "$messages" },
                },
            },
            ]);

        if(!user || user.length === 0){
            return Response.json({
                success : false,
                message : "User not found"
            }, {status : 404});
        }
        return Response.json({
            success : true,
            messages : user[0].messages
        }, {status : 200});

    } catch (error) {
        console.log("Error fetching messages:", error);
        return Response.json({
            success : false,
            message : "Error fetching messages"
        }, {status : 500});
    }
}