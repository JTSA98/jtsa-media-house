import { redirect } from "next/navigation";

/**
 * The staff sign-in page now lives at /admin/login. This route is kept so the
 * old address — which is what the guarded admin layout used to link to, and
 * what may already be bookmarked — does not dead-end on a 404.
 */
export default function StaffLoginRedirect() {
  redirect("/admin/login");
}