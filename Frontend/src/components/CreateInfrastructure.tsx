import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleUser, Command, Home, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./SideBar/Sidebar";
import ModeToggle from "./mode-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { Combobox } from "./Combobox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface User {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  photoURL: string | null;
  institute_id: number | null;
  type_id: number | null;
  is_active: boolean;
  gender: string;
}


export const CreateInfrastructure: FC = () => {
  const [user, setUser ] = useState<User | null>(null);
  const [infraDesc, setInfraDesc] = useState<string>("");
  const [infraBudget, setInfraBudget] = useState<number>();
  const [startDate, seStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [dept, setDept] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/departmentNames/${user?.institute_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Unexpected data format');
        }
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      }
    };


    if (user?.institute_id) {
      fetchDepartments();
    }
  }, [user?.institute_id]);


  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }


    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;


      if (decoded.exp < currentTime) {
        alert('Session expired. Please login again.');
        Cookies.remove('token');
        navigate('/login');
        return;
      }


      const userDetails: User = {
        username: decoded.username,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email,
        institute_id: decoded.institute_id,
        type_id: decoded.type_id,
        gender: decoded.gender
      };


      setUser(userDetails);
    } catch (err) {
      navigate('/login');
    }


    const loadDepartments = async () => {
      const deptData = await fetchDepartments();
      setDepartments(deptData);
    };


    loadDepartments();


  }, [navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
 
    try {
      const username = user?.username;
     
      const response = await fetch(`http://localhost:3000/api/create-infrastructure/${user?.institute_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({dept, infraDesc, infraBudget, startDate, endDate }),
      });
 
      if (response.ok) {
        alert('Infrastructure created successfully!');
        toast.success('Event created successfully!', {
          className: 'custom-toast',
          autoClose: 2000,
          onClose: () => navigate(`/admin/create-event`),
        });
        setInfraBudget(0);
        setDept("");
        setInfraDesc("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create event.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
    }
  };


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
      <Sidebar user={user} activePage="create-infrastructure" />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  to="/"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
          <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search or Type a Job"
                  className="h-10 px-3 mr-50 ring-offset-background file:border-0 file:bg-transparent file:text-sm
                  file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed py-2 ps-10 pe-16
                  block w-1/2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-200
                  focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700
                  dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                />
                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
                <Command className="absolute flex-shrink-0 size-3 text-gray-400 dark:text-white/60" />
                </div>
              </div>
            </form>
          </div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User Avatar" className="h-9 w-9 rounded-full" />
                ) : (
                  <CircleUser className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.username || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-2xl text-primary font-bold">Create Infrastructure</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
          <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-4 border-2">Create Infrastructure</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Create Infrastructure</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[410px] p-4">
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dept" className="text-left">Department</Label>
                    <Select name="dept" value={dept} onValueChange={(value) => setDept((value))}>
                      <SelectTrigger className="w-[475px]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Department</SelectLabel>
                          {departments.map((department) => (
                            <SelectItem key={department.dept_name} value={department.dept_name}>
                              {department.dept_name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="infradesc" className="text-left">Description</Label>
                    <Textarea id="infradesc" required value={infraDesc} onChange={(e) => setInfraDesc(e.target.value)} placeholder="Infrastructure Description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget" className="text-left">Budget</Label>
                    <Input id="budget" type="number" required min="1" value={infraBudget} onChange={(e) => setInfraBudget(e.target.value)} placeholder="Budget" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startdate" className="text-left">Start Date</Label>
                    <Input id="startdate" type="date" required value={startDate} onChange={(e) => seStartDate(e.target.value)} placeholder="Start Date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="enddate" className="text-left">End Date</Label>
                    <Input id="enddate" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" className="col-span-3" />
                  </div>
                </div>
                </ScrollArea>
                <DialogClose>
                  <Button type="submit" onClick={handleSubmit} className="mr-4">Create Infrastructure</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            </div>
        </main>
      </div>
    </div>
  );
};



