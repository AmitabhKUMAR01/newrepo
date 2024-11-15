import { NextRequest, NextResponse } from "next/server";

/**
 * Get users' info from their ID using parsed user data.
 * The `parsedUsersData` is assumed to be passed in the `usersData` query parameter as a JSON string.
 */

interface User {
  id: string;
  name: string;
  email: string;
  color: string;
}

function getUser(userId: string, allUsers: any[]): User | null {
  const user = allUsers.find((u) => u.value === userId);
  if (!user) return null;
  const [name, email] = user.label.split(" (");
  const cleanedEmail = email ? email.replace(")", "") : "";

 
  return {
    id: `${user.value}`, 
    name: name.trim(), 
    email: cleanedEmail, 
  };
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIds = searchParams.getAll("userIds");
  const usersData = searchParams.get("usersData");

  if (!usersData) {
    return new NextResponse("Missing usersData", { status: 400 });
  }

  let parsedUsersData;
  try {
    parsedUsersData = JSON.parse(decodeURIComponent(usersData)); 
  } catch (error) {
    return new NextResponse("Invalid JSON format in usersData", { status: 400 });
  }

  console.log("Parsed Users Data:", parsedUsersData);

  if (!Array.isArray(parsedUsersData)) {
    return new NextResponse("Invalid usersData format. It should be an array.", { status: 400 });
  }

  if (!userIds || userIds.length === 0) {
    return new NextResponse("Missing or invalid userIds", { status: 400 });
  }

  const users = userIds
    .map((userId) => getUser(userId, parsedUsersData))  
    .filter(Boolean);  

  if (users.length === 0) {
    return new NextResponse("No valid users found", { status: 404 });
  }

  return NextResponse.json(users);
}

