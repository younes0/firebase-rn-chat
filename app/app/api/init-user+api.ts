import { UserService } from "@/api/user/user.service";

const userService = new UserService();

export async function POST(request: Request) {
  const { data } = await request.json();

  await userService.init(data.userId);

  return Response.json({
    message: "User created",
  });
}
