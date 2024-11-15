import { NextRequest, NextResponse } from 'next/server';

/**
 * Returns a list of user IDs from a partial search input
 * For `resolveMentionSuggestions` in liveblocks.config.ts
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const usersData = searchParams.get('usersData');
  if (!usersData) {
    return new NextResponse('Missing usersData parameter', { status: 400 });
  }
  let parsedUsersData;
  try {
    parsedUsersData = JSON.parse(decodeURIComponent(usersData));
  } catch (error) {
    return new NextResponse(`Invalid JSON format in usersData ${error}`, {
      status: 400,
    });
  }
  const users = parsedUsersData.map((user: any) => ({
    id: user.value,
    name: user.label,
  }));

  const filteredUserIds = users.filter((user) =>
      text ? user.label.toLowerCase().includes(text.toLowerCase()) : true,
    ).map((user) => user.id);

  return NextResponse.json(filteredUserIds);
}
