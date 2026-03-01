import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/Schemas/signUpSchema";
import z from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    // Validate the query parameters using Zod
    const validationResult = UsernameQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      const usernameErrors =
        validationResult.error.format().username?._errors || [];

      console.error("Validation errors for username:", usernameErrors);

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = validationResult.data;

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username ",
      },
      { status: 500 }
    );
  }
}
