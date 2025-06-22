import { Button } from "@/components/ui/button";
import icon from "@/assets/icon.png"; // Vite alias (@/ = src)

const Navbar01Page = () => {
  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <img src={icon} alt="App Icon" className="max-w-12 max-h-12" />

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar01Page;
