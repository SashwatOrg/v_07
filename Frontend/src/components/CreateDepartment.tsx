import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CircleUser,
  Command,
  Home,
  Menu,
  Package2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './SideBar/Sidebar';
import ModeToggle from './mode-toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeptCard } from './DeptCard';

interface User {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  institute_id: number | null;
  type_id: number | null;
  is_active: boolean;
  gender: string;
}

interface DeptCardProps {
  dept_name: string;
  dept_type: number;
  institute_id: number;
  coordinator_id: number;
  coordinator_first_name: string;
  coordinator_last_name: string;
  coordinator_email: string;
  width?: string;
  height?: string;
  department_id: number;
}

export const CreateDepartment: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [department, setDepartment] = useState('');
  const [deptType, setDeptType] = useState('');
  const [deptSubType, setDeptSubType] = useState('');
  const [departments, setDepartments] = useState<DeptCardProps[]>([]);
  const [coordData, setCoordData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: 0,
    gender: '',
    password: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCoordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function fetchDepartments() {
    try {
      const response = await fetch('http://localhost:3000/api/departments');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const departments = await response.json();
      return departments;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  }

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
        gender: decoded.gender,
        is_active: true,
      };

      setUser(userDetails);
    } catch (err) {
      console.log(err);
      navigate('/login');
    }

    const loadDepartments = async () => {
      const deptData = await fetchDepartments();
      setDepartments(deptData);
    };

    loadDepartments();
  }, [navigate]);

  const handleDeptTypeChange = (value: string) => {
    setDeptType(value);
    if (value === 'Non-Academic') {
      setDepartment('');
    }
  };

  const handleDeptSubTypeChange = (value: string) => {
    setDeptSubType(value);
    setDepartment(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !department ||
      !deptType ||
      !coordData.first_name ||
      !coordData.last_name ||
      !coordData.email ||
      !coordData.password
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const username = user?.username;
      const institute_id = user?.institute_id;

      const response = await fetch(
        'http://localhost:3000/api/create-department',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            institute_id,
            department,
            deptType,
            coordData,
          }),
        }
      );

      if (response.ok) {
        setCoordData({
          username: '',
          first_name: '',
          last_name: '',
          email: '',
          phone_number: 0,
          gender: '',
          password: '',
        });
        setDepartment('');
        setDeptType('');
        setDeptSubType('');
        setIsDialogOpen(false);
        alert('Department and coordinator created successfully!');
        toast.success('Department created successfully!', {
          className: 'custom-toast',
          autoClose: 2000,
          onClose: () => navigate(`/dashboard/${username}`),
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create department.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.' + err);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(
          'http://localhost:3000/api/upload-departments',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          toast.success('Departments uploaded successfully!', {
            className: 'custom-toast',
            autoClose: 2000,
            onClose: () => navigate(`/dashboard/${user?.username}`),
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to upload departments.');
        }
      } catch (err) {
        toast.error(
          'An error occurred while uploading the file. Please try again later.' +
            err
        );
      }
    } else {
      toast.error('Please select a file to upload.');
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = 'path/to/template.xlsx'; // Replace with actual template URL
    link.setAttribute('download', 'department_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadData = () => {
    const link = document.createElement('a');
    link.href = 'path/to/data.xlsx'; // Replace with actual data URL
    link.setAttribute('download', 'departments_data.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
      <Sidebar user={user} activePage="create-department " />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0">
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
            <SheetContent side="left " className="flex flex-col">
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
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.username || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-2xl text-primary font-bold">
              Create Department
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-4 border-2">
                  Create Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Create Department</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="deptdetails" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-10 sticky">
                    <TabsTrigger value="deptdetails">
                      Department Details
                    </TabsTrigger>
                    <TabsTrigger value="coorddetails">
                      Co-ordinator Details
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="deptdetails">
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-left">
                          Department Name
                        </Label>
                        <Input
                          id="department"
                          type="string"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="Department Name"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="depttype" className="text-left">
                          Department Type
                        </Label>
                        <RadioGroup
                          value={deptType}
                          onValueChange={handleDeptTypeChange}
                        >
                          <div className="flex flex-row-2 gap-x-8 w-20">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="Academic" id="r1" />
                              <Label htmlFor="r1">Academic</Label>
                            </div>
                            <div className="flex items-center space-x-2 text-nowrap">
                              <RadioGroupItem value="Non-Academic" id="r2" />
                              <Label htmlFor="r2">Non-academic</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                      {deptType === 'Non-Academic' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="deptsubtype" className="text-left">
                            Sub Department Type
                          </Label>
                          <Select onValueChange={handleDeptSubTypeChange}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select Sub Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sub Types</SelectLabel>
                                <SelectItem value="Financials">
                                  Financials
                                </SelectItem>
                                <SelectItem value="Examination">
                                  Examination
                                </SelectItem>
                                <SelectItem value="Student Administration">
                                  Student Administration
                                </SelectItem>
                                <SelectItem value="Placement">
                                  Placement
                                </SelectItem>
                                <SelectItem value="Event">Event</SelectItem>
                                <SelectItem value="Infrastructure">
                                  Infrastructure
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="coorddetails">
                    <ScrollArea className="max-h-[410px] p-4">
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <div className="flex-1 sm:col-span-3 mr-3">
                            <Label htmlFor="first-name">First Name</Label>
                            <div className="mt-2">
                              <Input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                id="first-name"
                                value={coordData.first_name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="flex-1 sm:col-span-3">
                            <Label htmlFor="last-name">Last Name</Label>
                            <div className="mt-2">
                              <Input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                id="last-name"
                                value={coordData.last_name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex-1 sm:col-span-3 mr-3">
                            <Label htmlFor="email">Email</Label>
                            <div className="mt-2">
                              <Input
                                type="text"
                                name="email"
                                placeholder="Email"
                                id="email"
                                value={coordData.email}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="flex-1 sm:col-span-3">
                            <Label htmlFor="phonenumber">Phone Number</Label>
                            <div className="mt-2">
                              <Input
                                type="number"
                                name="phone_number"
                                placeholder="Phone Number"
                                id="phonenumber"
                                value={coordData.phone_number}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex-1 sm:col-span-3 mr-3">
                            <Label htmlFor="gender">Gender</Label>
                            <div className="mt-2">
                              <Select
                                name="gender"
                                onValueChange={(value) =>
                                  setCoordData((prevData) => ({
                                    ...prevData,
                                    gender: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-[315px]">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Gender</SelectLabel>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                      Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex-1 sm:col-span-3">
                            <Label htmlFor="username">Username</Label>
                            <div className="mt-2">
                              <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                id="username"
                                value={coordData.username}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center pt-2">
                            <Label htmlFor="password">Password</Label>
                          </div>
                          <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={coordData.password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                <DialogClose>
                  <Button type="submit" onClick={handleSubmit} className="mr-4">
                    Create Department
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-4 border-2">
                  Bulk Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Bulk Create Departments</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex gap-4 mt-4">
                    <Button onClick={handleBulkSubmit}>
                      Upload Departments
                    </Button>
                    <Button onClick={handleDownloadTemplate}>
                      Download Template
                    </Button>
                    <Button onClick={handleDownloadData}>Download Data</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="pl-3 grid gap-x-10 gap-y-4 grid-cols-2 md:grid-cols-3 md:gap-y-4 md:gap-x-16 lg:grid-cols-3 lg:gap-x-32 lg:gap-y-4">
            {departments.map((department) => (
              <DeptCard
                key={department.department_id}
                dept_name={department.dept_name}
                dept_type={department.dept_type}
                coordinator_email={department.coordinator_email}
                coordinator_first_name={department.coordinator_first_name}
                coordinator_last_name={department.coordinator_last_name}
                department_id={department.department_id}
                institute_id={department.institute_id}
                coordinator_id={department.coordinator_id}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
