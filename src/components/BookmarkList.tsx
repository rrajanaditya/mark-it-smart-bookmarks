"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bookmark } from "@/types";
import BookmarkItem from "./BookmarkItem";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";

interface BookmarkListProps {
    initialBookmarks: Bookmark[];
    userId: string;
}

export default function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        if (!userId) return;

        let channel: RealtimeChannel | null = null;

        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session && !channel) {
                channel = supabase
                    .channel(`rt_bookmarks_${userId}`)
                    .on("postgres_changes", { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` }, (payload) => {
                        const { eventType, new: newRecord, old: oldRecord } = payload;
                        setBookmarks((prev) => {
                            if (eventType === "INSERT") return [newRecord as Bookmark, ...prev];
                            if (eventType === "UPDATE") return prev.map((b) => (b.id === (newRecord as Bookmark).id ? (newRecord as Bookmark) : b));
                            if (eventType === "DELETE") return prev.filter((b) => b.id !== oldRecord.id);
                            return prev;
                        });
                    })
                    .subscribe();
            } else if (!session && channel) {
                supabase.removeChannel(channel);
                channel = null;
            }
        });

        return () => {
            authListener.unsubscribe();
            if (channel) supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    const deleteBookmark = useCallback(
        async (id: string) => {
            const previousBookmarks = [...bookmarks];
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
            toast.promise(
                (async () => {
                    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
                    if (error) throw error;
                })(),
                {
                    loading: "Deleting...",
                    success: "Bookmark deleted",
                    error: (err) => {
                        setBookmarks(previousBookmarks); 
                        return `Delete failed: ${err.message}`;
                    },
                },
            );
        },
        [supabase, bookmarks],
    );

    return (
        <div className="mx-auto mt-8 grid w-full max-w-5xl gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((b) => (
                <BookmarkItem key={b.id} bookmark={b} onDelete={deleteBookmark} supabase={supabase} />
            ))}
        </div>
    );
}
