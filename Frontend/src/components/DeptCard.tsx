import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { User } from "lucide-react";

interface DeptCardProps {
  dept_name: string;
  dept_type: number;
  department_id: number;
  institute_id: number;
  coordinator_id: number;
  coordinator_first_name: string;
  coordinator_last_name: string;
  coordinator_email: string;
  width?: string;
  height?: string;
}

export function DeptCard({
  dept_name,
  dept_type,
  coordinator_email,
  coordinator_first_name,
  coordinator_last_name,
  width = "300px",
  height = "180px"
}: DeptCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPublishStatus = async () => {

    };
    
    fetchPublishStatus();
  }, []);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
        <Card 
          style={{ width, height }} 
          className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <CardHeader>
            <CardTitle className="text-center tracking-tight text-lg font-medium">
              {dept_name}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex flex-col items-start p-2">
            <div className="text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{coordinator_first_name+" "+coordinator_last_name}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
        </DialogTrigger>

        <DialogContent className="p-6 max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-4">{dept_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mb-4">
            <p><b>Department Type:</b> {dept_type}</p>
            <p><b>Coordinator Name:</b> {coordinator_first_name+" "+coordinator_last_name}</p>
            <p><b>Coordinator Email:</b> {coordinator_email}</p>
          </div>
          <DialogClose asChild>
            <Button className="mt-4 py-2 px-4 rounded">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}