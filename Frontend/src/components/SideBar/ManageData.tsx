import { Button } from "@/components/ui/button";
import { FC, useState, useEffect } from "react";
import { AddPlacementDataDialog } from "./CoOrdinatorComponent/AddPlacementDataDialog";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FileSpreadsheet } from "lucide-react";
import { Home, FileInput, Layout } from "lucide-react";

interface ManageData {
  activePage: string;
  user: {
    userid: number | null; // Unique ID of the user
    first_name: string | null; // First name of the user
    last_name: string | null; // Last name of the user
    email: string | null; // Email of the user
    username: string | null; // Username of the user
    type_id: number | null; // Type ID of the user (e.g., role)
    institute_id: number | null; // ID of the associated institute
    is_active: boolean; // Active status of the user
  };
}

export const ManageData: FC<ManageData> = ({ user, activePage }) => {
  const [departmentName, setDepartmentName] = useState<string | null>(null);

  // Log the user object to check if it's being passed correctly
  // console.log("ManageData component received user id:", user.userid);
  // console.log("ManageData component received user email:", user.email);

  useEffect(() => {
    // Log to confirm that the useEffect is running
    // console.log("Inside useEffect - user is:", user);
    // console.log("Inside useEffect - user id is:", user?.userid);
    // console.log("Inside useEffect - user email is:", user?.email);

    if (!user?.userid) return; // If there's no valid user ID, exit early

    const fetchDepartments = async () => {
      try {
        console.log(
          "Sending request to fetch department for user ID:",
          user.userid
        );
        const response = await fetch(
          `http://localhost:3000/get-department/${user.userid}`
        );
        if (!response.ok) {
          console.log("Response not OK:", response);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("the data is ", data);
        const temp_name = data.dept_name;
        setDepartmentName(temp_name); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartmentName(""); // Set empty string on error
      }
    };

    fetchDepartments();
  }, [user?.userid]); // Depend on user.userid to trigger effect on changes
  {
    console.log("the department name is ", departmentName);
  }
  return (
    <div className="flex flex-col space-y-4">
      {/* Conditionally render the Finance link based on departmentName */}
      {departmentName === "Financials" && (
        <>
          <Link
            to="/add-finance"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "add-finance"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Finance
          </Link>

          <Link
            to="/generate-finance-report"
            state={{ user }} // Pass the user object here
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "generate-finance"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Generate Financial Report
          </Link>
        </>
      )}

      {/* Conditionally render Add Placement Data Dialog */}
      {departmentName === "Placement" && (
        <>
          {/* not done yet  */}
          <AddPlacementDataDialog user={user} />
          <Link
            to="/add-opportunity"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "create-opportunity"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Add Opportunities
          </Link>

          <Link
            to="/generate-placement-report"
            state={{ user }} // Pass the user object here
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "generate-placement"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Generate Placement Report
          </Link>
        </>
      )}

      {/* for InfraStructure Cordinaotor */}
      {departmentName === "Infrastructure" && (
        <>
          <Link
            to="/generate-infrastructure-report"
            state={{ user }} // Pass the user object here
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "generate-infrastructure"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Generate Infrastructure Report
          </Link>
        </>
      )}

      {/* for event coordinator  */}
      {departmentName === "Event" && (
        <>
          <Link
            to="/generate-event-report"
            state={{ user }} // Pass the user object here
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "generate-event"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Generate Event Report
          </Link>
        </>
      )}
      {/* for Club Co-oridnator  */}
      {departmentName === "Club" && (
        <>
          <Link
            to="/generate-club-report"
            state={{ user }} // Pass the user object here
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "generate-event"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Generate Club Report
          </Link>

          <Link
                    to="/co-ordinator/create-club"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                      activePage === 'create-club'
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Create Club
                  </Link>
        </>
      )}
      {/* for Student And Faculty Administration Co-oridnator  */}
      {departmentName === "Student And Faculty Administration" && (
        <>
          <Link
            to="/generate-studentandfacultyadministration-report"
            state={{ user }} // Pass the user object here
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              activePage === "generate-student-and-faculty-administration"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Generate Student And Faculty Administration Report
          </Link>

        </>
      )}
      {/* Any Coordinator can give feedback */}
      <>
        <Link
          to="/feedback"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            activePage === "feedback"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <FileInput className="h-4 w-4" />
          Give Feedback
        </Link>

        {/* Any Coordinator can upload media */}
        <Link
          to="/media"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            activePage === "media"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <FileInput className="h-4 w-4" />
          Add Media & Description
        </Link>

        <Link
          to="/co-ordinator/create-achievement"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            activePage === "create-achievement"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Achievements
        </Link>
      </>
    </div>
  );
};

export default ManageData;
