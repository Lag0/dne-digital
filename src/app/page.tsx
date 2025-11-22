import { notFound, redirect } from "next/navigation";
import { STUDENT_IDS } from "@/constants";

export default function Home() {
  const [firstStudent] = STUDENT_IDS;

  if (!firstStudent) {
    notFound();
  }

  redirect(`/${firstStudent}`);
}
