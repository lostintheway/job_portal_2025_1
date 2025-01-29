import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 w-64 p-4 transition-all duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } absolute h-full z-10`}
    >
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/gallery">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Gallery
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/portfolio">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Portfolio
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
