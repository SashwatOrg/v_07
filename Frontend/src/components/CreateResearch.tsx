import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CircleUser,
  Command,
  Home,
  Menu,
  Package2,
  Search,
  Trash2,
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
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


//hk


import * as XLSX from "xlsx";


//hk

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


export const CreateResearch: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [researchDesc, setResearchDesc] = useState("");
  const [researchFund, setResearchFund] = useState("");
  const [fundedBy, setFundedBy] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [emailFields, setEmailFields] = useState<string[]>([""]);
  const [publicationDate, setPublicationDate] = useState<Date>();
  const [publisher, setPublisher] = useState("");
  const [researchPaperLink, setResearchPaperLink] = useState("");


  const navigate = useNavigate();

  const fetchPhotoURL = async (userid: number | null) => {
    console.log(userid);


    if (!userid) return;


    try {
      // const response = await fetch(`/api/get-photo-url?user_id=${userId}`);


      const response = await fetch(
        `http://localhost:3000/api/user-photo/${userid}`
      );


      const data = await response.json();


      console.log(data.photoURL);


      if (response.ok && data.photoURL) {
        // setUser((prevUser) => ({


        //   ...prevUser,


        //   photoURL: data.photoUrl,


        // }));


        console.log('data.photoUrl', data.photoURL);


        setUser((prevUser) => ({
          ...(prevUser ?? {
            photoURL: null,


            institute_id: null,


            userid: null,


            email: null,


            first_name: null,


            last_name: null,


            username: null,


            department: null,


            type_id: null,


            gender: null,


            is_active: false,


            mobile: null,
          }), // Default empty values for user


          photoURL: data.photoURL,
        }));


        console.log(user?.photoURL); // setUser({ ...user, photoURL: data.photoUrl });
      }
    } catch (error) {
      console.error('Error fetching photo URL:', error);
    }
  };

  useEffect(() => {
    if (user?.userid) {
      fetchPhotoURL(user.userid);
      const interval = setInterval(fetchPhotoURL, 600000, user.userid);
      return () => clearInterval(interval);
    }
  });
  const handleEmailChange = (index: number, value: string) => {
    const newEmailFields = [...emailFields];
    newEmailFields[index] = value;
    setEmailFields(newEmailFields);
  };


  const addEmailField = () => {
    setEmailFields([...emailFields, ""]); // Add a new empty email field
  };


  const deleteEmailField = (index: number) => {
    const newEmailFields = emailFields.filter((_, i) => i !== index); // Remove the email field at the specified index
    setEmailFields(newEmailFields);
  };


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

      setUser(userDetails);
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }


    const data = {
      title,
      researchDesc,
      researchFund,
      fundedBy,
      status,
      publicationDate,
      publisher,
      researchPaperLink,
      people: emailFields,
    };


    try {
      const response = await fetch(
        `http://localhost:3000/api/create-research`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );


      if (response.ok) {
        alert("Research created successfully!");
        toast.success("Research created successfully!", {
          className: "custom-toast",
          autoClose: 2000,
          onClose: () => navigate(`/admin/create-event`),
        });
        setFundedBy("");
        setResearchDesc("");
        setResearchFund("");
        setTitle("");
        setEmailFields([""]);
        setPublisher("");
        setResearchPaperLink("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create event.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    }
  };
  //hk
  const [file, setFile] = useState<File | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };


  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }


    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData


    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }


    try {
      const response = await fetch(
        `http://localhost:3000/api/bulk-upload-research`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send the FormData containing the file
        }
      );


      if (response.ok) {
        toast.success("Research data uploaded successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to upload data.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    }
  };


  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/bulk-download-template",
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );


      if (!response.ok) {
        throw new Error("Failed to download template");
      }


      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "research_template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Template downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading template: " + error.message);
    }
  };

  const handleLogout = async () => {
    Cookies.remove('token'); // Remove the token on logout
    setUser(null);
    navigate('/login');
  };
  const handleDownloadResearchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/download-research-data",
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );


      if (!response.ok) {
        throw new Error("Failed to download research data");
      }


      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "research_data.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Research data downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading research data: " + error.message);
    }
  };


  //hk


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
      <Sidebar user={user} activePage="create-research" />
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
                  {user?.username || 'My Account'}
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
            <h1 className="text-2xl text-primary font-bold">Research Work</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-4 border-2">
                  Create Research
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Create Research</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="basicdetails" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-10 sticky">
                    <TabsTrigger value="basicdetails">
                      Basic Details
                    </TabsTrigger>
                    <TabsTrigger value="resdetails">
                      Researcher Details
                    </TabsTrigger>
                    <TabsTrigger value="publicdetails">
                      Publication Details
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="basicdetails">
                    <ScrollArea className="max-h-[410px] p-4 overflow-y-auto">
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="researchtitle" className="text-left">
                            Research Title
                          </Label>
                          <Input
                            id="researchtitle"
                            type="string"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Research Title"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-left">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            type="string"
                            required
                            value={researchDesc}
                            onChange={(e) => setResearchDesc(e.target.value)}
                            placeholder="Description"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="funds" className="text-left">
                            Fund Amount (In INR)
                          </Label>
                          <Input
                            id="funds"
                            type="number"
                            min="0"
                            required
                            value={researchFund}
                            onChange={(e) => setResearchFund(e.target.value)}
                            placeholder="Fund Amount"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fundedby" className="text-left">
                            Funded By
                          </Label>
                          <Input
                            id="fundedby"
                            type="string"
                            required
                            value={fundedBy}
                            onChange={(e) => setFundedBy(e.target.value)}
                            placeholder="Funded By"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="resdetails">
                    <ScrollArea className="max-h-[410px] p-4 overflow-y-auto">
                      <div className="grid gap-4 py-4">
                        {emailFields.map((email, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 items-center gap-4 mb-2"
                          >
                            <Label
                              htmlFor={`email${index}`}
                              className="text-left"
                            >{`Person ${index + 1} Email`}</Label>
                            <div className="col-span-3 flex items-center gap-4">
                              <Input
                                id={`email${index}`}
                                type="email"
                                required
                                value={email}
                                onChange={(e) =>
                                  handleEmailChange(index, e.target.value)
                                }
                                placeholder={`Person ${index + 1} Email`}
                                className="flex-grow"
                              />
                              {/* Disable trash button if there is only one email field */}
                              {emailFields.length === 1 ? (
                                <Trash2 className="text-gray-400 cursor-not-allowed" />
                              ) : (
                                <Trash2
                                  className="text-red-500 cursor-pointer"
                                  onClick={() => deleteEmailField(index)}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="grid grid-cols-4 items-right place-self-right gap-4">
                          <Button onClick={addEmailField} className="mt-2">
                            Add Person
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="publicdetails">
                    <ScrollArea className="max-h-[410px] p-4 overflow-y-auto">
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 text-nowrap">
                          <Label htmlFor="depttype" className="text-left">
                            Research Status
                          </Label>
                          <RadioGroup value={status} onValueChange={setStatus}>
                            <div className="flex flex-row-2 gap-x-8 w-20">
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="In Progress" id="r1" />
                                <Label htmlFor="r1">In Progress</Label>
                              </div>
                              <div className="flex items-center space-x-2 text-nowrap">
                                <RadioGroupItem value="Published" id="r2" />
                                <Label htmlFor="r2">Published</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>


                        {/* Conditionally render additional fields if "Published" is selected */}
                        {status === "Published" && (
                          <>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="publicationDate"
                                className="text-left"
                              >
                                Publication Date
                              </Label>
                              <Input
                                id="publicationDate"
                                type="date"
                                value={publicationDate}
                                onChange={(e) =>
                                  setPublicationDate(e.target.value)
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="publisher" className="text-left">
                                Publisher
                              </Label>
                              <Input
                                id="publisher"
                                type="text"
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="researchPaperLink"
                                className="text-left"
                              >
                                Research Paper Link
                              </Label>
                              <Input
                                id="researchPaperLink"
                                type="url"
                                value={researchPaperLink}
                                onChange={(e) =>
                                  setResearchPaperLink(e.target.value)
                                }
                                className="col-span-3"
                                placeholder="https://example.com/research-paper"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                <DialogClose>
                  <Button type="submit" onClick={handleSubmit} className="mr-4">
                    Create Event
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-4 border-2">
                  Bulk Create Research
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Bulk Create Research</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                  <Button onClick={handleUpload}>Upload</Button>
                  <Button onClick={handleDownload}>
                    Download Research Template
                  </Button>
                  <Button onClick={handleDownloadResearchData}>
                    Download Research Data
                  </Button>
                </div>
                <DialogClose>
                  <Button type="button" className="mr-4">
                    Close
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};






