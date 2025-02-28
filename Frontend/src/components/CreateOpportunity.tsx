import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleUser, Command, Home, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./SideBar/Sidebar";
import ModeToggle from "./mode-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
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


export const CreateOpportunity: FC = () => {
  const [user, setUser ] = useState<User | null>(null);
  const [organization, setOrganization] = useState<string | null>("");
  const [position, setPosition] = useState<string | null>("");
  const [income, setIncome] = useState<number | null>();
  const [startsFrom, setStartsFrom] = useState<Date | null>();
  const [endsOn, setEndsOn] = useState<Date | null>();
  const [type, setType] = useState<string | null>("");
  const [isEndsOnDisabled, setIsEndsOnDisabled] = useState<boolean>(false);
  const navigate = useNavigate();


  const handleTypeChange = (value: string) => {
    setType(value);
    setIsEndsOnDisabled(value === "Full-time" || value === "Part-time");
    if(value === "Full-time" || value === "Part-time")
      setEndsOn(null);
  };


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
      console.error(err);
    }
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
     
      const response = await fetch(`http://localhost:3000/api/add-opportunity/${user?.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, organization, position, income, startsFrom, endsOn, type }),
      });
 
      if (response.ok) {
        alert('Opportunity added successfully!');
        toast.success('Opportunity added successfully!', {
          className: 'custom-toast',
          autoClose: 2000,
          onClose: () => navigate(`/admin/add-opportunity`),
        });
        setOrganization("");
        setPosition("");
        setIncome(0);
        setType("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add opportunity.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
      console.error(err);
    }
  };


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
      <Sidebar user={user} activePage="create-opportunity" />
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
            <h1 className="text-2xl text-primary font-bold">Add Opportunity</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
          <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-4 border-2">Add Opportunity</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Add Opportunity</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[410px] p-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="organization" className="text-left">Type</Label>
                    <Select name="type" onValueChange={handleTypeChange}>
                      <SelectTrigger className="w-[475px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Opportunity Type</SelectLabel>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="organization" className="text-left">Organization</Label>
                    <Input id="organization" type="string" required value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Organization" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-left">Position</Label>
                    <Input id="position" type="string" required value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="compensation" className="text-left">Compensation</Label>
                    <Input id="compensationposition" type="string" required value={income} onChange={(e) => setIncome(e.target.value)} placeholder="Compensation" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="starts" className="text-left">Starts from</Label>
                    <Input id="starts" type="date" required value={startsFrom} onChange={(e) => setStartsFrom(e.target.value)} placeholder="Starts from" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ends" className="text-left">Ends on</Label>
                    <Input id="ends" type="date" required value={endsOn} onChange={(e) => setEndsOn(e.target.value)} placeholder="Intake" className="col-span-3" disabled={isEndsOnDisabled} />
                  </div>
                </div>
                </ScrollArea>
                <DialogClose>
                  <Button type="submit" onClick={handleSubmit} className="mr-4">Add Opportunity</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            </div>
        </main>
      </div>
    </div>
  );
};



