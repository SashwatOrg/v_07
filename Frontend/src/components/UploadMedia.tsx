import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CircleUser ,
  Command,
  Home,
  Menu,
  Package2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./SideBar/Sidebar";
import ModeToggle from "./mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

interface User {
  userid: number | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  photoURL: string | null;
  institute_id: number | null;
  department: string | null;
  mobile: string | null;
  type_id: number | null;
  is_active: boolean;
  gender: string;
}

interface Department {
  dept_name: string;
}

interface Event {
  event_name: string; // Assuming event has a name
}

export const UploadMedia: FC = () => {
  const [user, setUser ] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [events, setEvents] = useState<Event[]>([]); // State for events
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(""); // New state for Title
  const [description, setDescription] = useState(""); // Changed from feedback
  const [media, setMedia] = useState<File | null>(null); // State for uploaded media
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        alert("Session expired. Please login again.");
        Cookies.remove("token");
        navigate("/login");
        return;
      }

      const userDetails: User = {
        userid: decoded.id,
        username: decoded.username,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email_id,
        institute_id: decoded.institute_id,
        department: decoded.department,
        type_id: decoded.type_id,
        gender: decoded.gender,
        photoURL: decoded.photoURL,
        is_active: false,
        mobile: decoded.mobile_number,
      };


      setUser (userDetails);
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!user?.institute_id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/departmentNames/${user.institute_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format");
        }
        setDepartments(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]); // Set empty array on error
      }
    };

    fetchDepartments();
  }, [user?.institute_id]);

  useEffect(() => {
    // Fetch events when the department is selected
    const fetchEvents = async () => {
      if (selectedDepartmentName === "Event") {
        try {
          const response = await fetch(`http://localhost:3000/api/eventNames/${user?.institute_id}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (!Array.isArray(data)) {
            throw new Error("Unexpected data format");
          }
          setEvents(data); // Update state with fetched events
        } catch (error) {
          console.error("Error fetching events:", error);
          setEvents([]); // Set empty array on error
        }
      } else {
        setEvents([]); // Clear events if department is not "Event"
      }
    };

    fetchEvents();
  }, [selectedDepartmentName]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentName = e.target.value;
    setSelectedDepartmentName(departmentName);
    setSelectedEventName(null); // Reset event selection
    setTitle(""); // Reset title
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(e.target.files[0]); // Set the uploaded media file
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!selectedDepartmentName || !description || !title || !media) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("username", user?.username || "");
    formData.append("departmentName", selectedDepartmentName);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("media", media);

    try {
      const response = await fetch("http://localhost:3000/api/submit-media", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        toast.success("Media submitted successfully!", {
          className: "custom-toast",
          autoClose: 1000,
        });
        // Clear form inputs
        setSelectedDepartmentName(null);
        setSelectedEventName(null);
        setTitle("");
        setDescription("");
        setMedia(null);
      } else {
        const errorData = await response.json();
        console.error("Error submitting media:", errorData);
        toast.error(errorData.message || "Failed to submit media.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting media.", {
        className: "custom-toast",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
      <Sidebar user={user} activePage="media" />
      <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
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
                    className="h-10 px-3 mr-50 ring-offset -background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed py-2 ps-10 pe-16 block w-1/2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-200 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                  />
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
                    <Command className="absolute flex-shrink-0 size-3 text-gray-400 dark:text-white/60" />
                  </div>
                </div>
              </form>
            </div>
            <div className="">
              <ModeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User  Avatar"
                      className="h-9 w-9 rounded-full"
                    />
                  ) : (
                    <CircleUser className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.displayName || 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${user?.userid}`)}
                >
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/support')}>
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-2xl text-primary font-bold">Media</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-4 border-2">
                  Add Media
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Submit Media</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[410px] p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-left">
                          Department
                        </Label>
                        <select
                          id="department"
                          required
                          value={selectedDepartmentName || ""}
                          onChange={handleDepartmentChange}
                          className="col-span-3 border rounded-md p-2"
                        >
                          <option value="" disabled>
                            Select a department
                          </option>
                          {departments.map((department, index) => (
                            <option
                              key={`${department.dept_name}-${index}`}
                              value={department.dept_name}
                            >
                              {department.dept_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {selectedDepartmentName === "Event" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="event" className="text-left">
                            Event
                          </Label>
                          <select
                            id="event"
                            required
                            value={selectedEventName || ""}
                            onChange={(e) => {
                              const eventName = e.target.value;
                              setSelectedEventName(eventName);
                              setTitle(eventName); // Automatically fill title
                            }}
                            className="col-span-3 border rounded-md p-2"
                          >
                            <option value="" disabled>
                              Select an event
                            </option>
                            {events.map((event, index) => (
                              <option
                                key={`${event.event_name}-${index}`}
                                value={event.event_name}
                              >
                                {event.event_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-left">
                          Title
                        </Label>
                        <Input
                          id="title"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter title here"
                          className="col-span-3 border rounded-md p-2"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-left">
                          Description
                        </Label>
                        <textarea
                          id="description"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter your description here"
                          className="col-span-3 border rounded-md p-2"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="media" className="text-left">
                          Upload Photo
                        </Label>
                        <input
                          id="media"
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleMediaChange}
                          className="col-span-3 border rounded-md p-2"
                        />
                      </div>
                    </div>
                    <DialogClose>
                      <Button type="submit" className="mr-4">
                        Submit Media
                      </Button>
                    </DialogClose>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            {/* Alert dialog for confirmation */}
            <Dialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alert</DialogTitle>
                  <DialogDescription>
                    You need to log in again to continue. Do you want to log
                    out?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    No
                  </Button>
                  <Button variant="primary" onClick={handleLogout}>
                    Yes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};