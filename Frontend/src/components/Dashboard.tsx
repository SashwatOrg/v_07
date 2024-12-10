import { FC, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { StatsCard } from './StatsCard';
import { PieInteractive } from './visuals/PieInteractive';
import {
  CircleUser,
  Home,
  Menu,
  Package2,
  Search,
  Command,
  User,
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
import ModeToggle from './mode-toggle';
import { Sidebar } from './SideBar/Sidebar';
import PolarAreaChart from "./visuals/PolarChart";
import PlacementChart from './visuals/PlacementChart';


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


export const Dashboard: FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();


  // User state
  const [user, setUser] = useState<User | null>(null);
  console.log(user);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userType, setUserType] = useState<number | null>(null);


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
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
    console.log('the token is', token);
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;


      if (decoded.exp < currentTime) {
        alert('Session expired. Please login again.');
        Cookies.remove('token');
        navigate('/login');
        return;
      } else if (decoded.username !== username) {
        navigate('/login');
        return;
      }


      // Assuming the decoded token has these fields
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


      // console.log('the user details',userDetails);
      // console.log("DataType of type_id is:", typeof user?.type_id);


      setUser(userDetails);
      setNotificationCount(decoded.notificationCount || 0); // Set notification count if available
      setUserType(decoded.type_id);
    } catch (err) {
      navigate('/login');
    }
  }, [username, navigate]);


  const handleLogout = async () => {
    Cookies.remove('token'); // Remove the token on logout
    setUser(null);
    navigate('/login');
  };
  // console.log('the user at dashboard is', user);
  useEffect(() => {
    if (user?.userid) {
      fetchPhotoURL(user.userid);
      const interval = setInterval(fetchPhotoURL, 600000, user.userid);
      return () => clearInterval(interval);
    }
  });


  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr] bg-customBackground">
        <Sidebar user={user} activePage="dashboard" />
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
              <h1 className="text-2xl text-primary font-bold">
                Welcome,{' '}
                {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
                  'User'}
              </h1>
            </div>
            <div className='grid grid-cols-[2fr_1fr] gap-8 flex flex-col'>
            <div className="pl-3 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {user?.type_id === 1 && (
                <>
                  {/* Admin-specific cards */}
                  <StatsCard title="Programs Offered" entity="departments" username={user?.username} />
                  <StatsCard title="Total Departments" entity="programs" username={user?.username} />
                  <StatsCard title="Faculty Count" entity="faculty" username={user?.username} />
                  <StatsCard title="Total Students" entity="students" username={user?.username}/>
                </>
              )}
              {user?.type_id === 2 && (
                <>
                  {/* Coordinator-specific cards */}
                  <StatsCard title="Tasks Assigned" entity="departments" username={user?.username} />
                  <StatsCard title="Ongoing Programs" entity="departments" username={user?.username}  />
                  <div className="col-span-full">
                    <PieInteractive />
                  </div>
                </>
              )}
              {user?.type_id === 3 && (
                <>
                  {/* Faculty-specific cards */}
                  <StatsCard title="Classes Taken" entity="departments" username={user?.username} />
                  <StatsCard title="Research Papers" entity="departments" username={user?.username} />
                  <div className="col-span-full">
                    <PieInteractive />
                  </div>
                </>
              )}
              {user?.type_id === 4 && (
                <>
                  {/* Student-specific cards */}
                  <StatsCard title="Subjects Enrolled" entity="departments" username={user?.username} />
                  <StatsCard title="Assignments Due" entity="departments" username={user?.username}/>
                  <div className="col-span-full">
                    <PieInteractive />
                  </div>
                </>
              )}
            </div>
           
                {user?.type_id === 1 && (
               <div className="flex-1 bg-white rounded-lg shadow-xl mt-4 p-8">
               <h4 className="text-xl text-gray-900 font-bold">Activity log</h4>
               <div className="relative px-4">
                   <div className="absolute h-full border border-dashed border-opacity-20 border-secondary"></div>


                   <div className="flex items-center w-full my-6 -ml-1.5">
                       <div className="w-1/12 z-10">
                           <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                       </div>
                       <div className="w-11/12">
                           <p className="text-sm">Profile informations changed.</p>
                           <p className="text-xs text-gray-500">3 min ago</p>
                       </div>
                   </div>


                   <div className="flex items-center w-full my-6 -ml-1.5">
                       <div className="w-1/12 z-10">
                           <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                       </div>
                       <div className="w-11/12">
                           <p className="text-sm">
                               Connected with <a href="#" className="text-blue-600 font-bold">Colby Covington</a>.</p>
                           <p className="text-xs text-gray-500">15 min ago</p>
                       </div>
                   </div>


                   <div className="flex items-center w-full my-6 -ml-1.5">
                       <div className="w-1/12 z-10">
                           <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                       </div>
                       <div className="w-11/12">
                           <p className="text-sm">Invoice <a href="#" className="text-blue-600 font-bold">#4563</a> was created.</p>
                           <p className="text-xs text-gray-500">57 min ago</p>
                       </div>
                   </div>


                   <div className="flex items-center w-full my-6 -ml-1.5">
                       <div className="w-1/12 z-10">
                           <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                       </div>
                       <div className="w-11/12">
                           <p className="text-sm">
                               Message received from <a href="#" className="text-blue-600 font-bold">Cecilia Hendric</a>.</p>
                           <p className="text-xs text-gray-500">1 hour ago</p>
                       </div>
                   </div>


                   <div className="flex items-center w-full my-6 -ml-1.5">
                       <div className="w-1/12 z-10">
                           <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                       </div>
                       <div className="w-11/12">
                           <p className="text-sm">New order received <a href="#" className="text-blue-600 font-bold">#OR9653</a>.</p>
                           <p className="text-xs text-gray-500">2 hours ago</p>
                       </div>
                   </div>
                
                   <div className="flex items-center w-full my-6 -ml-1.5">
                       <div className="w-1/12 z-10">
                           <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                       </div>
                       <div className="w-11/12">
                           <p className="text-sm">
                               Message received from <a href="#" className="text-blue-600 font-bold">Jane Stillman</a>.</p>
                           <p className="text-xs text-gray-500">2 hours ago</p>
                       </div>
                   </div>
               </div>
           </div>

              )}
            </div>
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {user?.institute_id && user.type_id === 1 && (
                <>
                  <PieInteractive institute_id={user.institute_id} />
                  <PolarAreaChart institute_id={user.institute_id} />
                  <PlacementChart institute_id={user.institute_id} />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};





