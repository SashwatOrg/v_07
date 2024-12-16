import { Link, useNavigate } from 'react-router-dom';
import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from "@/assets/Login_Page/login-img-two.svg";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";

export const LoginForm: FC = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [utype, setUType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('the details sent are', username, password);
      const response = await fetch('http://localhost:3000/api/loginMe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('the response from back i s',data)
      if (response.ok) {
        Cookies.set('token', data.token, { expires: 0.5 });
        console.log('success',username)
        toast.success('Login successful!', {
          className: 'custom-toast',
          autoClose: 1000,
          onClose: () => navigate(`/dashboard/${username}`),
        });
      } else {
        setError(data.message || 'Login failed');
        toast.error('Invalid Credentials!', {
          className: 'custom-toast',
          autoClose: 1000,
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-row h-screen w-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-gradient-to-r from-blue-700 to-teal-500 animate__animated animate__fadeIn animate__delay-1s h-full">
        <img
          src={loginImage}
          alt="Login Illustration"
          className="w-[80%] h-[80%] max-w-[400px] max-h-[400px] rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-white p-10 h-full">
        <div className="w-full max-w-xl shadow-lg rounded-lg p-8 bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h2>
          <p className="text-center text-gray-500 mb-6">
            Enter your username and password to log in
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <Label htmlFor="utype">User Type</Label>
              <Select name="utype" onValueChange={(value) => setUType((value))}>
                        <SelectTrigger className="w-[475px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>User Type</SelectLabel>
                            <SelectItem value="Institute Admin">Institute Admin</SelectItem>
                            <SelectItem value="Coordinator">Coordinator</SelectItem>
                            <SelectItem value="Faculty">Faculty</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
              {formErrors.username && (
                <p className="text-red-500 text-sm">{formErrors.username}</p>
              )}
            </div>
            {/* Username */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm">{formErrors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/forgot-password" className="text-blue-500 hover:underline text-sm">
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-gradient-to-l transition-all duration-500"
            >
              Login
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center my-4">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <a href="/" className="text-blue-500 hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
