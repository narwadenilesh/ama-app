import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameScahemaValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username : usernameScahemaValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username     : searchParams.get('username')
        }
        // validate with zod
        const result = usernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success : false,
                message : usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
                errors : usernameErrors
            }, {status : 400});
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified : true });
        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "Username is already taken"
            }, {status : 200});
        }
        return Response.json({
            success : true,
            message : "Username is available"
        }, {status : 200});

    } catch (error) {
        console.log("Error checking username uniqueness:", error);
        return Response.json({
            success : false,
            message : "Error checking username uniqueness"
        }, {status : 500});
    }
}
