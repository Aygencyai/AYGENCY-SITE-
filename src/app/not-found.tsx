import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-void">
      <div className="text-center px-6">
        <p className="font-heading font-bold text-8xl text-cyan/20">404</p>
        <h1 className="font-heading font-semibold text-2xl text-ghost mt-4">
          Page not found
        </h1>
        <p className="text-ghost-muted mt-2 max-w-md mx-auto">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been
          moved.
        </p>
        <div className="mt-8">
          <Button variant="primary" href="/">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
