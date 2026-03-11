import { Spin } from "antd";
import { Suspense } from "react";
import Carriers from "./components/carriers";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Suspense fallback={<Spin spinning={true} />}>
            <Carriers />
        </Suspense>
      </main>
    </div>
  );
}
