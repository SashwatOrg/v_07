
import React, { useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid"; // For icons
import { motion } from "framer-motion"; // For animations

interface User {
  [x: string]: ReactNode;
  userId: string | null;
  photoURL: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  username: string | null;
  institute_id: string | null;
  mobile: string | null;
  type_id: number | null; // Added type_id for user role
}

interface ProfileProps {
  user: User;
  onClose: () => void;
  updateUserPhoto: (photoURL: string) => void;
}

const Profile: React.FC<ProfileProps> = ({
  user,
  onClose,
  updateUserPhoto,
}) => {
  const { userid } = useParams<{ userid: string }>();
  const [activeSection, setActiveSection] = useState("photo");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [securitySubSection, setSecuritySubSection] = useState<string | null>(
    null
  );
  const [uploadStatus, setUploadStatus] = useState<string | null>(null); // Upload status message
  const [personalInfo, setPersonalInfo] = useState<User | null>(null); // State for personal information
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [updatedInfo, setUpdatedInfo] = useState({
    first_name: "",
    last_name: "",
    username: "",
  }); // State for updated information

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    console.log(userid);
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("userid", String(userid)); // Correct key
    // console.log("User ID being sent:", user.userid);
    // formData.append("userId", String(user.userid));
    console.log("User ID being sent:", userid);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload-profile-photo",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // const { photoURL }= response.data.url; // Access the photoURL from the response
      console.log(response.data.url);
      // updateUserPhoto(photoURL);
      updateUserPhoto(response.data.url);
      setUploadStatus("Profile photo updated successfully!");
    } catch (error) {
      console.error("Failed to upload photo:", error);
      setUploadStatus("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/${userid}`
      );
      setPersonalInfo(response.data);
      setUpdatedInfo({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        username: response.data.username || "",
      });
    } catch (error) {
      console.error("Failed to fetch personal information:", error);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateInfo = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/${userid}`,
        {
          first_name: updatedInfo.first_name,
          last_name: updatedInfo.last_name,
          username: updatedInfo.username,
        }
      );
      alert("Personal information updated successfully!");
      setPersonalInfo(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update personal information:", error);
      alert("Failed to update personal information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // const handleUpdatePassword = async () => {
  //   try {
  //     const currentPassword = document.querySelector(
  //       'input[placeholder="Current Password"]'
  //     )?.value;
  //     const newPassword = document.querySelector(
  //       'input[placeholder="New Password"]'
  //     )?.value;
  //     const confirmPassword = document.querySelector(
  //       'input[placeholder="Confirm New Password"]'
  //     )?.value;

  //     if (!currentPassword || !newPassword || !confirmPassword) {
  //       alert("Please fill in all the fields.");
  //       return;
  //     }

  //     if (newPassword !== confirmPassword) {
  //       alert("New Password and Confirm Password do not match.");
  //       return;
  //     }

  //     const response = await axios.put(
  //       `http://localhost:3000/api/update-password`,
  //       {
  //         userId: userid,
  //         currentPassword,
  //         newPassword,
  //       }
  //     );

  //     alert("Password updated successfully!");
  //   } catch (error) {
  //     console.error("Failed to update password:", error);
  //     alert("Failed to update password. Please try again.");
  //   }
  // };

  const handleUpdatePassword = async () => {
    // Get the input values from state
    const userId = userid; // Replace with your state variable holding `user_id`
    const currentPassword = document.querySelector(
      'input[placeholder="Current Password"]'
    )?.value;
    const newPassword = document.querySelector(
      'input[placeholder="New Password"]'
    )?.value;
    const confirmPassword = document.querySelector(
      'input[placeholder="Confirm New Password"]'
    )?.value; // Replace with your confirm password state
    console.log("user id  ", userId);
    console.log("current password is ", currentPassword);
    console.log("new password is ", newPassword);
    // Validate input fields
    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      // Call the backend API
      const response = await fetch(`http://localhost:3000/api/updatepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          newPassword,
          currentPassword,
        }),
      });

      console.log("response is ", response);
      if (!response.ok) {
        if (response.status === 404) {
          alert("User not found or no changes made.");
        } else {
          throw new Error("Failed to update password.");
        }
        return;
      }else{
        alert("Password updated successfully.");
      }

      const data = await response.json();

      // Handle success response
      alert(data.message);
      // Reset the form or state variables if needed
      setUserIdState(""); // Clear user ID field
      setCurrentPasswordState(""); // Clear current password field
      setNewPasswordState(""); // Clear new password field
      setConfirmPasswordState(""); // Clear confirm password field
      setSecuritySubSection(null); // If using security subsection state
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (activeSection === "info") {
      fetchPersonalInfo();
    }
  }, [activeSection]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        {/* Navigation Buttons */}
        <div className="flex justify-around mb-4">
          <Button
            variant={activeSection === "photo" ? "default" : "outline"}
            onClick={() => setActiveSection("photo")}
          >
            Profile Photo
          </Button>
          <Button
            variant={activeSection === "info" ? "default" : "outline"}
            onClick={() => setActiveSection("info")}
          >
            Personal Information
          </Button>
          <Button
            variant={activeSection === "security" ? "default" : "outline"}
            onClick={() => setActiveSection("security")}
          >
            Security
          </Button>
          <Button
            variant={activeSection === "account" ? "default" : "outline"}
            onClick={() => setActiveSection("account")}
          >
            Account
          </Button>
        </div>

        {/* Content Section */}
        <div className="mt-4">
          {activeSection === "photo" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Update Profile Photo
              </h3>
              <div className="mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="h-24 w-24 rounded-full"
                  />
                ) : (
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="Profile Avatar"
                    className="h-24 w-24 rounded-full"
                  />
                )}
              </div>
              <div>
                <h2>Upload Profile Photo</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
                {uploadStatus && <p>{uploadStatus}</p>}
              </div>
            </div>
          )}

          {activeSection === "info" && personalInfo && (
           

            <Card className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg border border-gray-200">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-3xl text-gray-900 font-bold">
                  <CheckCircleIcon className="inline-block h-8 w-8 text-green-500 mr-2" />
                  Personal Information
                </CardTitle>
                <PencilIcon
                  className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-800 transition-all"
                  onClick={() => setIsEditing(true)}
                />
              </CardHeader>

              <Separator className="my-6" />
 
              <CardContent>
                {isEditing ? (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <Input
                        id="first_name"
                        type="text"
                        placeholder="Enter your first name"
                        value={updatedInfo.first_name}
                        onChange={(e) =>
                          setUpdatedInfo({
                            ...updatedInfo,
                            first_name: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <Input
                        id="last_name"
                        type="text"
                        placeholder="Enter your last name"
                        value={updatedInfo.last_name}
                        onChange={(e) =>
                          setUpdatedInfo({
                            ...updatedInfo,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={updatedInfo.username}
                        onChange={(e) =>
                          setUpdatedInfo({
                            ...updatedInfo,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="default"
                          onClick={handleUpdateInfo}
                          disabled={isSaving}
                          className="py-3 px-6 bg-green-500 text-white hover:bg-green-600 transition-all"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="py-3 px-6 border-gray-300 hover:border-gray-500 hover:bg-gray-100 transition-all"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-gray-700">
                        <strong className="text-gray-900">First Name:</strong>{" "}
                        {personalInfo.first_name}
                      </p>
                      <p className="text-gray-700">
                        <strong className="text-gray-900">Last Name:</strong>{" "}
                        {personalInfo.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <strong className="text-gray-900">Username:</strong>{" "}
                        {personalInfo.username}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <strong className="text-gray-900">Email:</strong>{" "}
                        {personalInfo.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <strong className="text-gray-900">
                          Mobile Number:
                        </strong>{" "}
                        {personalInfo.mobile}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <strong className="text-gray-900">Role:</strong>{" "}
                        {getRoleName(personalInfo.type_id)}
                      </p>
                    </div>

                    {/* Edit Button */}
                    <div className="text-center mt-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="default"
                          onClick={() => setIsEditing(true)}
                          className="py-3 px-6 bg-blue-500 text-white hover:bg-blue-600 transition-all"
                        >
                          Edit Information
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          )}

          {/* {activeSection === "security" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Security</h3>
              <p>Manage your account security settings here.</p>
            </div>
          )} */}

          {/* {activeSection === "security" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="mb-4">
                <Button
                  className="mb-2"
                  onClick={() => setActiveSection("updatePassword")}
                >
                  Update Password
                </Button>
                <Button
                  className="mb-2"
                  variant="outline"
                  onClick={() => setActiveSection("resetPassword")}
                >
                  Reset Password
                </Button>
              </div>


              {activeSection === "updatePassword" && (
                <div>
                  <h4 className="text-md font-semibold mb-2">
                    Update Password
                  </h4>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    className="mb-2"
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    className="mb-2"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    className="mb-4"
                  />
                  <Button onClick={handleUpdatePassword}>
                    Update Password
                  </Button>
                </div>
              )}

              {activeSection === "resetPassword" && (
                <div>
                  <h4 className="text-md font-semibold mb-2">Reset Password</h4>
                  <p className="mb-4">
                    If you have forgotten your password, you can reset it by
                    clicking the button below. A reset link will be sent to your
                    registered email.
                  </p>
                  <Button onClick={handleResetPassword}>Send Reset Link</Button>
                </div>
              )}
            </div>
          )} */}

          {activeSection === "security" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              {!securitySubSection && (
                <div className="mb-4">
                  <Button
                    className="mb-2"
                    onClick={() => setSecuritySubSection("updatePassword")}
                  >
                    Update Password
                  </Button>
                  <Button
                    className="mb-2"
                    variant="outline"
                    onClick={() => setSecuritySubSection("resetPassword")}
                  >
                    Reset Password
                  </Button>
                </div>
              )}

              {securitySubSection === "updatePassword" && (
                <div>
                  <h4 className="text-md font-semibold mb-2">
                    Update Password
                  </h4>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    className="mb-2"
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    className="mb-2"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    className="mb-4"
                  />
                  <Button onClick={handleUpdatePassword}>
                    Update Password
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setSecuritySubSection(null)}
                  >
                    Back
                  </Button>
                </div>
              )}

              {securitySubSection === "resetPassword" && (
                <div>
                  <h4 className="text-md font-semibold mb-2">Reset Password</h4>
                  <p className="mb-4">
                    If you have forgotten your password, you can reset it by
                    clicking the button below. A reset link will be sent to your
                    registered email.
                  </p>
                  <Button onClick={handleResetPassword}>Send Reset Link</Button>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setSecuritySubSection(null)}
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeSection === "account" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Account</h3>
              <p>Manage your account settings here.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getRoleName = (typeId: number | null) => {
  switch (typeId) {
    case 0:
      return "appAdmin";
    case 1:
      return "Admin";
    case 2:
      return "Coordinator";
    case 3:
      return "Faculty";
    case 4:
      return "Student";
    default:
      return "Unknown";
  }
};

const handleUpdatePassword = async () => {
  try {
    const currentPassword = document.querySelector(
      'input[placeholder="Current Password"]'
    )?.value;
    const newPassword = document.querySelector(
      'input[placeholder="New Password"]'
    )?.value;
    const confirmPassword = document.querySelector(
      'input[placeholder="Confirm New Password"]'
    )?.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all the fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    const response = await axios.put(
      `http://localhost:3000/api/update-password`,
      {
        userId: userid,
        currentPassword,
        newPassword,
      }
    );

    alert("Password updated successfully!");
  } catch (error) {
    console.error("Failed to update password:", error);
    alert("Failed to update password. Please try again.");
  }
};

const handleResetPassword = async () => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/reset-password`,
      { email: User.email }
    );
    alert("Password reset link sent to your registered email.");
  } catch (error) {
    console.error("Failed to send reset link:", error);
    alert("Failed to send reset link. Please try again.");
  }
};

export default Profile;
