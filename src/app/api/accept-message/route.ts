import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user
    if(!session || !session?.user){
        return Response.json({
            success : false,
            message : "Not authonticated"
        }, {status : 401});
    }
    const userId = user._id;
    const {AcceptMessages} = await request.json();

    try {
        const UpdatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages : AcceptMessages }, {new : true});

        if(!UpdatedUser){
            return Response.json({
                success : false,
                message : "failed to update user status to accept messages"
            }, {status : 404});
        }
        return Response.json({
            success : true,
            message : "message acceptance status updated successfully",
            UpdatedUser,
        }, {status : 200});

        
    } catch (error) {
        console.log("failed to update user status to accept messages:", error);
        return Response.json({
            success : false,
            message : "Failed to update user status to accept messages"
        }, {status : 500});
    }
     

}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user
    if(!session || !session?.user){
        return Response.json({
            success : false,
            message : "Not authonticated"
        }, {status : 401});
    }   
    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId)

    if(!foundUser){
        return Response.json({
            success : false,
            message : "User not found"
        }, {status : 404});
    }
    return Response.json({
        success : true,
        message : "User message acceptance status retrieved successfully",
        isAcceptingMessages : foundUser.isAcceptingMessages
    }, {status : 200});
    } catch (error) {
        console.log("Error retrieving user message acceptance status:", error);
        return Response.json({
            success : false,
            message : "Error in getting message acceptance status"
        }, {status : 500});
    }
}
        