export interface Bookmark {
  id: string
  created_at: string
  title: string
  url: string
  user_id: string
}

export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: Partial<T>
}