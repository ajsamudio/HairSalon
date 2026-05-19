import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-brand focus:font-semibold"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
      <MobileBookBar />
    </>
  );
}
