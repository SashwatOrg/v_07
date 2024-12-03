import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  width?: string;
  height?: string;
}

export function StatsCard({ title, width = "250px", height = "100px" }: StatsCardProps) {
  return (
    <Card 
      style={{ width, height }} 
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <CardHeader>
        <CardTitle className="align-middle tracking-tight text-sm font-medium">
          {title}
        </CardTitle>
        <Skeleton className="h-5"/>
      </CardHeader>
    </Card>
  );
}
