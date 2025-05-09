import { LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-primary text-white shadow-md z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-4">
            <LineChart className="h-5 w-5" />
            <h1 className="text-xl font-medium">Stock Analysis</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="flex items-center text-white hover:bg-primary-light">
              <span>Real-time Stock Market Analysis</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
