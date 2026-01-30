import { Header } from "@/app/components/header";
import { EventList } from "@/app/components/event-list";
import { Footer } from "@/app/components/footer";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EventList />
      <Footer />
    </div>
  );
}
