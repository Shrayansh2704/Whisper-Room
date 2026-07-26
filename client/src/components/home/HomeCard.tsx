import { Card, CardContent } from "@/components/ui/card";
import type { PropsWithChildren } from "react";

function HomeCard({ children }: PropsWithChildren) {
    return (
        <Card className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur">
            <CardContent className="space-y-8 p-8">
                {children}
            </CardContent>
        </Card>
    );
}

export default HomeCard;