import { adminLogin } from "../actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";

    const password = formData.get("password") as string;
    const result = await adminLogin(password);

    if (!result.success) {
      // Server action will handle the error
      // For now, we'll redirect back to login with an error
      redirect("/admin/login?error=1");
    } else {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md glass border-purple-200 dark:border-purple-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Enter password"
                className="border-purple-200 dark:border-purple-800"
                required
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
