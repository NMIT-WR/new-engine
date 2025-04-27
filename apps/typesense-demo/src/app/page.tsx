import Header from '@/components/header';
import Search from '@/components/search';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="fixed inset-0 z-[-2] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(161,161,170,0.2),rgba(255,255,255,0))] bg-background"></div>
      <main className="container mx-auto flex-1 items-start gap-10 py-8 md:px-0">
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <h1 className="scroll-m-20 font-bold text-4xl tracking-tight lg:text-5xl">
            ASP Ukázka hledání
          </h1>
          <p className="text-lg text-muted-foreground lg:text-xl">
            Ukázka nového hledání pomocí naší nové technologie.
          </p>
        </div>
        <Search />
      </main>
    </div>
  );
}
