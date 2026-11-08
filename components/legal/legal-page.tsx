import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-32 pb-20 md:pt-40 md:pb-28">
        <Container className="max-w-3xl">
          <h1 className="text-h2 font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            {title}
          </h1>
          {updated && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{updated}</p>
          )}
          <div className="mt-8 flex flex-col gap-8">{children}</div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
