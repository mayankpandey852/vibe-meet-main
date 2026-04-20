import { getMeetups, getGroups } from "@/lib/actions";
import MeetupsClient from "./client";

export const dynamic = "force-dynamic";

export default async function MeetupsPage() {
    const meetups = await getMeetups();
    const groups = await getGroups();

    return <MeetupsClient initialMeetups={meetups} initialGroups={groups} />;
}
