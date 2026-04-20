import { getSpots } from "@/lib/actions";
import PlacesClient from "./client";

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
    const spots = await getSpots();

    return <PlacesClient initialSpots={spots} />;
}
