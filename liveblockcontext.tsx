'use client';

import { createContext } from 'react';

import { User } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';
import { LiveblocksProvider } from '@liveblocks/react/suspense';
import { TooltipProvider } from '@kit/ui/tooltip';
import { useFetchOrganizationMembers } from '../../editor/[id]/_components/share-data-provider';

interface AccountWorkspace {
  accounts: Database['public']['Views']['user_accounts']['Row'][];
  account: Database['public']['Functions']['team_account_workspace']['Returns'][0];
  user: User;
}

export const TeamAccountWorkspaceContext = createContext<AccountWorkspace>(
  {} as AccountWorkspace,
);

export function LiveblocksContextProvider(
  props: React.PropsWithChildren<{ value: AccountWorkspace }>,
) {
const usersQuery = useFetchOrganizationMembers({ account: 'newteam' });
  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        // Passing custom headers and body to your endpoint
        const headers = {
          "Content-Type": "application/json",
        };
    
        const body = JSON.stringify({
          room,
          workspace_slug: props.value.account.slug,
        });
    
        const response = await fetch("/api/liveblocks/auth", {
          method: "POST",
          headers,
          body,
        });
    
        return await response.json();
      }}
      resolveUsers={async ({ userIds }) => {
        console.log("userIds", userIds)
        const searchParams = new URLSearchParams(
          userIds.map((userId) => ["userIds", userId])
        );
        const serializedUsersData = encodeURIComponent(JSON.stringify(usersQuery?.data));
        const response = await fetch(`/api/users?${searchParams.toString()}&usersData=${serializedUsersData}`);
        if (!response.ok) {
          throw new Error("Problem resolving users");
        }
        const users = await response.json();
        return users;
      }}
      resolveMentionSuggestions={async ({ text }) => {
        const serializedUsersData = encodeURIComponent(JSON.stringify(usersQuery?.data));

        const response = await fetch(
          `/api/users/search?text=${encodeURIComponent(text)}&usersData=${serializedUsersData}`
        );

        if (!response.ok) {
          throw new Error("Problem resolving mention suggestions");
        }    
        const userIds = await response.json();
        return userIds;
      }}
    >
      <TooltipProvider>{props.children}</TooltipProvider>
    </LiveblocksProvider>
  );
}
