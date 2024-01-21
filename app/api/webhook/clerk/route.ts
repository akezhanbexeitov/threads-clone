/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { OrganizationInvitationJSON, OrganizationJSON, WebhookEvent } from '@clerk/nextjs/server'
import { addMemberToCommunity, createCommunity, updateCommunityInfo } from '@/lib/actions/community.actions';
import { NextResponse } from 'next/server';

type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organization.updated"
  | "organization.deleted"
  | "organizationInvitation.accepted"

const eventTypes: Record<string, EventType> = {
  organizationCreated: "organization.created",
  organizationUpdated: "organization.updated",
  organizationDeleted: "organization.deleted",
  organizationInvitationCreated: "organizationInvitation.created",
  organizationInvitationAccepted: "organizationInvitation.accepted",
  organizationMembershipCreated: "organizationMembership.created",
  organizationMembershipDeleted: "organizationMembership.deleted",
}

export async function POST(req: Request) {
 
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const eventData = evt.data
  const eventType = evt.type;
 
  switch (eventType) {
    case eventTypes.organizationCreated:
      try {
        const { id, name, slug, logo_url, image_url, created_by } = eventData as OrganizationJSON

        await createCommunity({
          id,
          name,
          username: slug,
          image: logo_url || image_url,
          bio: "org bio",
          createdById: created_by
        });

        return NextResponse.json({ message: "User created" }, { status: 201 });
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case eventTypes.organizationUpdated:
      try {
        const { id, logo_url, name, slug } = eventData as OrganizationJSON

        await updateCommunityInfo({
          communityId: id,
          name,
          username: slug,
          image: logo_url,
        });

        return NextResponse.json({ message: "Member removed" }, { status: 201 });
      } catch (err) {
        console.log(err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case eventTypes.organizationInvitationCreated:
      try {
        return NextResponse.json(
          { message: "Invitation created" },
          { status: 201 }
        );
      } catch (err) {
        console.log(err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case eventTypes.organizationInvitationAccepted:
      try {
        const { organization_id, email_address } = eventData as OrganizationInvitationJSON

        // @ts-ignore
        await addMemberToCommunity(organization_id, email_address);

        return NextResponse.json(
          { message: "Invitation accepted" },
          { status: 201 }
        );
      } catch (err) {
        console.log(err);

        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

  }
 
  return new Response('', { status: 200 })
}
 