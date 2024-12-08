"use client";

import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CircleUser,
  Home,
  Menu,
  Package2,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "../SideBar/Sidebar";
import ModeToggle from "../mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { ClubDataTableDemo } from "./optionsForCustomizedReport/ClubDataTableDemo";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

// Enhanced Report Option Interface
interface ReportOption {
  id: string;
  description: string;
  tooltip?: string;
}

// Comprehensive Report Options
const REPORT_OPTIONS: ReportOption[] = [
  { 
    id: "1", 
    description: "Club Basic Information",
    tooltip: "Comprehensive details about club structure, leadership, and foundational data"
  },
  { 
    id: "2", 
    description: "Club Activities Comprehensive Analysis",
    tooltip: "Detailed breakdown of club activities, event types, and frequency"
  },
  { 
    id: "3", 
    description: "Financial Performance Report",
    tooltip: "In-depth financial analysis including budgets, expenses, and funding sources"
  },
  { 
    id: "4", 
    description: "Event Type and Impact Metrics",
    tooltip: "Analysis of event diversity, participant engagement, and club reach"
  },
  { 
    id: "5", 
    description: "Membership Dynamics",
    tooltip: "Comprehensive insights into club membership, retention, and growth"
  },
  { 
    id: "6", 
    description: "Event Participation Insights",
    tooltip: "Detailed metrics on event participation, attendance, and member involvement"
  },
  { 
    id: "7", 
    description: "Club Performance and Impact Assessment",
    tooltip: "Holistic evaluation of club performance, achievements, and strategic contributions"
  }
];

// User Interface
interface User {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  photoURL?: string | null;
  institute_id: number | null;
  type_id: number | null;
  is_active?: boolean;
  gender: string;
}

export const GenerateClubReport: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCustomized, setIsCustomized] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  });
  const [showReportTypeDialog, setShowReportTypeDialog] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Authentication and User Retrieval
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
        toast.error("Session expired. Please login again.");
        Cookies.remove("token");
        navigate("/login");
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
      };
      setCurrentUser(userDetails);
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  // Logout Handler
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  // Report Generation Handler
  const handleGenerateReport = async (format: string) => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const endpoint = format === "pdf" 
      ? "/pdf/generate-club-pdf" 
      : "/pdf/generate-club-html";
      const yearLowerLimit = selectedYear.split('-')[0];
    const body = {
      options: isCustomized 
        ? selectedOptions 
        : REPORT_OPTIONS.map(option => option.id),
        year: yearLowerLimit,
      user: {
        first_name: currentUser?.first_name,
        last_name: currentUser?.last_name,
        institute_id: currentUser?.institute_id,
        email: currentUser?.email,
      },
      format,
    };

    try {
      setIsLoading(true);
      setProgress(50);
      console.log('Request Body:', body);
      console.log('Full URL:', `http://localhost:3000${endpoint}`);
      
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers));

      if (response.ok) {
        const data = await response.json();
        console.log('Response Data:', data);
        const filePath = format === "pdf" 
          ? `http://localhost:3000/pdfs/${data.filePath}`
          : `http://localhost:3000${data.filePath}`;

        if (format === "pdf") {
          window.open(filePath, "_blank");
        } else {
          const link = document.createElement("a");
          link.href = filePath;
          link.download = data.filePath.split("/").pop();
          link.click();
        }

        toast.success("Report generated successfully!");
        setProgress(100);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to generate report.");
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      toast.error("An error occurred while generating the report.");
    } finally {
      setShowReportTypeDialog(false);
      setIsLoading(false);
    }
  };
  const handleToggleCustomized = () => {
    setIsCustomized(prev => !prev);
    
    // Reset selected options when switching
    if (!isCustomized) {
      // When switching to customized, clear selections
      setSelectedOptions([]);
    } else {
      // When switching to default, select all options
      setSelectedOptions(REPORT_OPTIONS.map(option => option.id));
    }
  };
  // Year Options Generation
  const yearOptions = Array.from({ length: 24 }, (_, i) => {
    const year = 2000 + i;
    return `${year}-${year + 1}`;
  });

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isCustomized && selectedOptions.length === 0) {
      toast.error("Please select at least one option for the customized report.");
      return;
    }

    if (!isCustomized) {
      setSelectedOptions(REPORT_OPTIONS.map(option => option.id));
    }

    setShowReportTypeDialog(true);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px 1fr] lg:grid-cols-[230px_1fr]">
      <Sidebar user={currentUser } activePage="generate-club" />
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link to="/" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-4 ml-auto">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  {currentUser ?.photoURL ? (
                    <img src={currentUser .photoURL} alt="User  Avatar" className="h-9 w-9 rounded-full" />
                  ) : (
                    <CircleUser  className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{currentUser ?.username || "My Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>Profile Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-2xl text-primary font-bold">Generate Club Report</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="flex items-center mb-4">
                <Label className="mr-2">Report Type:</Label>
                <Switch checked={isCustomized} onCheckedChange={handleToggleCustomized} />
              </div>
              <p className="mb-4 text-gray-600">
                {isCustomized 
                  ? "You are generating a customized report. Please select the options below." 
                  : "You are generating the default report."}
              </p>
              <div className="mb-4">
                <Label className="mr-2">Select Year:</Label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border rounded p-2 bg-white text-black dark:bg-gray-800 dark:text-white"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {isCustomized && (
                <ClubDataTableDemo 
                  setSelectedOptions={setSelectedOptions} 
                />
              )}
              <Button type="submit" className="mt-4 ">
                Generate Report
              </Button>
            </form>

            {isLoading && (
              <div className="mt-4">
                <Progress value={progress} className="w-[60%]" />
              </div>
            )}

            <Dialog open={showReportTypeDialog} onOpenChange={setShowReportTypeDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Report Format</DialogTitle>
                  <DialogDescription>
                    Please choose the format for the report to download.
                  </DialogDescription>
 </DialogHeader>
                <div className="flex justify-between">
                  <Button onClick={() => handleGenerateReport("pdf")}>PDF</Button>
                  <Button onClick={() => handleGenerateReport("html")}>HTML</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};