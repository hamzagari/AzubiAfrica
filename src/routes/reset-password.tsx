import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password | AzubiAfrica" },
      { name: "description", content: "Set a new password for your AzubiAfrica admin account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Reset password | AzubiAfrica" },
      { property: "og:description", content: "Set a new password for your AzubiAfrica admin account." },
    ],
  }),
  component: ResetPassword,
});

const input = "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm";

function ResetPassword() {
  const [valid, setValid] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The reset link opens this page with a recovery token in the URL hash.
    const isRecoveryLink = window.location.hash.includes("type=recovery");
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValid(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      // A session is already present when Supabase has exchanged the recovery token.
      if (data.session && isRecoveryLink) setValid(true);
      else if (data.session) setValid(true);
      else if (!isRecoveryLink) setValid(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Your new password must be at least 6 characters long.");
    if (pw !== pw2) return toast.error("The two passwords do not match. Please try again.");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error("Could not update your password. Please request a new reset link and try again.");
    setDone(true);
    toast.success("Your password has been updated. You can now log in.");
    return undefined;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-primary">Set a new password</h1>
      {valid === null ? null : done ? (
        <div className="mt-6 rounded-xl border bg-card p-6">
          <p className="text-sm">Your password has been changed successfully.</p>
          <Link to="/admin" className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Go to login
          </Link>
        </div>
      ) : !valid ? (
        <div className="mt-6 rounded-xl border bg-card p-6">
          <p className="text-sm">This reset link is invalid or has expired. Please request a new one from the login page.</p>
          <Link to="/admin" className="mt-4 inline-block text-sm text-success underline">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input className={input} type="password" required minLength={6} placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <input className={input} type="password" required minLength={6} placeholder="Confirm new password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          <button className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground">Save new password</button>
        </form>
      )}
    </div>
  );
}
