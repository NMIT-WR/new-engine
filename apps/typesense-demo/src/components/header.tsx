import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-1/5 items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ModeToggle />
      </div>
    </header>
  );
}
