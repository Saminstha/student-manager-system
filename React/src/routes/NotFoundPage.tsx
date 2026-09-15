import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-lg font-medium">Page Not Found</h2>
      <p className="text-sm text-muted-foreground">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
}

export default NotFoundPage;
