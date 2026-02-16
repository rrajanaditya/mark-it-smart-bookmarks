"use client";
import { useState, memo } from "react";
import { Bookmark } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";

interface ItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  supabase: SupabaseClient;
}

const BookmarkItem = memo(({ bookmark, onDelete, supabase }: ItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ title: bookmark.title, url: bookmark.url });

  const handleUpdate = async () => {
    setIsEditing(false);
    toast.promise(
        (async () => {
            const { error } = await supabase
                .from("bookmarks")
                .update({ title: editValues.title, url: editValues.url })
                .eq("id", bookmark.id);
            
            if (error) throw error;
        })(), 
        {
            loading: 'Updating bookmark...',
            success: 'Bookmark updated!',
            error: (err) => `Update failed: ${err.message}`,
        }
    );
  };

  return (
    <div className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 backdrop-blur-2xl p-6 
      ${isEditing ? "border-blue-400 bg-blue-50/40 ring-2 ring-blue-400/20 shadow-2xl scale-[1.02]" : "border-blue-200/40 bg-blue-50/20 shadow-xl shadow-blue-500/5 hover:-translate-y-1.5 hover:bg-blue-50/40"}`}>
      
      <div className="relative z-10 mb-6">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              className="bg-white/60 border text-black border-blue-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400/50"
              value={editValues.title}
              onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
            />
            <input
              className="bg-white/60 border text-black border-blue-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-400/50"
              type="url"
              value={editValues.url}
              onChange={(e) => setEditValues(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-800 line-clamp-1 group-hover:text-blue-600">{bookmark.title}</h3>
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="inline-block text-xs font-semibold text-blue-500/80 hover:text-blue-700 underline-offset-4 hover:underline break-all">
              {bookmark.url.replace(/^https?:\/\//, "")}
            </a>
          </>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-blue-100/30 pt-4">
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleUpdate} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">Save</button>
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-200/50 rounded-lg hover:bg-slate-200 transition-all">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-500/10 rounded-lg hover:bg-blue-600 hover:text-white transition-all">Edit</button>
          )}
        </div>
        {!isEditing && (
          <button onClick={() => onDelete(bookmark.id)} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white">Delete</button>
        )}
      </div>
    </div>
  );
});

BookmarkItem.displayName = "BookmarkItem";
export default BookmarkItem;