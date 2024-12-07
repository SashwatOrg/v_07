import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import studentsIcon from "./icons/students.png";
import facultyIcon from "./icons/faculty.png";
import departmentsIcon from "./icons/departments.png";
import programsIcon from "./icons/programs.png";
import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StatsCardProps {
  title: string;
  entity: "students" | "faculty" | "departments" | "programs";
  username: string | null | undefined;
  width?: string;
  height?: string;
}

export function StatsCard({
  title,
  entity,
  username,
  // width = "250px",
  // height = "100px",
}: StatsCardProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Map entity to the corresponding image and colors
  const entityData: Record<string, { icon: string; color: string }> = {
    students: { icon: studentsIcon, color: "text-blue-500 bg-blue-100" },
    faculty: { icon: facultyIcon, color: "text-green-500 bg-green-100" },
    departments: { icon: departmentsIcon, color: "text-red-500 bg-red-100" },
    programs: { icon: programsIcon, color: "text-yellow-500 bg-yellow-100" },
  };

  useEffect(() => {
    async function fetchCount() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/admin/count-${entity}/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching count:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, [entity, username]);

  return (
    <TooltipProvider>
  <Tooltip>
        
    <Card
      className="w-auto rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:border-2 hover:border-black w-auto"
      // style={{ width, height }}
    >
      <div className="relative">
        <div className="absolute top-5 left-5">
        <TooltipTrigger asChild>
          <CircleHelp />
          </TooltipTrigger>
          <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
        </div>
      </div>
      <CardHeader className="flex flex-col items-center justify-center h-full">
        {loading ? (
          <Skeleton className="h-5" />
        ) : (
          <>
            {/* Circular background with the specific color */}
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${entityData[entity].color}`}
            >
              {/* Icon with the filter applied */}
              <img
                src={entityData[entity].icon}
                alt={`${entity} icon`}
                className="w-8 h-8"
              />
            </div>

            <p className="font-bold text-center text-5xl">{count ?? "N/A"}</p>
            <p className="tracking-tight text-center font-medium">{title}</p>
          </>
        )}
      </CardHeader>
    </Card>
    </Tooltip>
    </TooltipProvider>
  );
}



// import { Skeleton } from "@/components/ui/skeleton"
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// interface StatsCardProps {
//   title: string;
//   entity: "students" | "faculty" | "departments" | "programs";
//   username: string;
//   width?: string;
//   height?: string;
// }

// export function StatsCard({ title, height = "100px" }: StatsCardProps) {
//   return (
//     <Card
//       style={{ height }}
//       className="w-auto rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:border-2 hover:border-black"
//     >
//       <CardHeader>
//         <CardTitle className="align-middle tracking-tight text-sm font-medium">
//           {title}
//         </CardTitle>
//         <Skeleton className="h-5"/>
//       </CardHeader>
//     </Card>
//   );
// }
