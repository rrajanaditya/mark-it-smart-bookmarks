import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AddBookmark from "@/components/AddBookmark";
import BookmarkList from "@/components/BookmarkList";
import "material-icons/iconfont/outlined.css";
import Navbar from "@/components/Navbar";

export default async function Home() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: bookmarks } = await supabase.from("bookmarks").select("*").eq("user_id", user?.id).order("created_at", { ascending: false });
    return (
        <main className="w-screen h-screen min-h-screen mx-auto bg-white ">
            <Navbar />
            <div className="flex flex-col h-fit">
                <AddBookmark />
                <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
            </div>
        </main>
    );
}
