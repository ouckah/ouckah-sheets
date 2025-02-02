import { auth } from "@/auth/config";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const session = await auth();
  return <NavbarClient session={session} />;
}
