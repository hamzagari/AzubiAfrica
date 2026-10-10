<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Listings live in the `listings` table; imports upsert on (source_type, external_id) so future API/RSS feeds can update rows idempotently.
- UI strings go through `src/lib/i18n.tsx` (de default, fr, en); add every new string to all three dictionaries.
- Admin rights come from `user_roles` via `has_role`; the first signed-up account becomes admin by trigger.
