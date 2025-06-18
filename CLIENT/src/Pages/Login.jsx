// 3O2AQAANy1S4aW6m
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authapi"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"


const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerLoading, isSuccess: registerSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginLoading, isSuccess: loginSuccess }] = useLoginUserMutation();


  const navigate = useNavigate();


  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    // console.log(inputData);
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };


  useEffect(() => {
    if (registerSuccess && registerData) {
      toast.success(registerData.message || "Signup successfull");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup failed");
    }
    if (loginSuccess && loginData) {
      toast.success(loginData.message || "Login successfull");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Login failed");
    }
  },
    [loginLoading, registerLoading, loginError, registerError, loginData, registerData])
  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account and click sign up when you are done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                <Input type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. Kavya"
                  required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. abc@gmail.com"
                  required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="*****"
                  required="true" />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerLoading} onClick={() => handleRegistration("signup")}>
                {
                  registerLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait
                    </>
                  ) : 'Signup'
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After sign up, you will be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. abc@gmail.com"
                  required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="*****"
                  required="true" />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginLoading} onClick={() => handleRegistration("login")}>
                {
                  loginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait
                    </>
                  ) : "Login"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

  )
}

export default Login