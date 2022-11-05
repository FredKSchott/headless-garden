export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      feed_items: {
        Row: {
          id: number
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      post_interactions: {
        Row: {
          id: number
          post_id: string
          user_id: string
          action: number
          created_at: string
        }
        Insert: {
          id?: number
          post_id: string
          user_id: string
          action: number
          created_at?: string
        }
        Update: {
          id?: number
          post_id?: string
          user_id?: string
          action?: number
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          handle: string
          created_at: string
          updated_at: string
          avatar_image_id: string | null
          name: string
          bio: string | null
          pronouns: string | null
          location: string | null
          website: string | null
        }
        Insert: {
          id: string
          handle: string
          created_at?: string
          updated_at?: string
          avatar_image_id?: string | null
          name: string
          bio?: string | null
          pronouns?: string | null
          location?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          handle?: string
          created_at?: string
          updated_at?: string
          avatar_image_id?: string | null
          name?: string
          bio?: string | null
          pronouns?: string | null
          location?: string | null
          website?: string | null
        }
      }
      relationships: {
        Row: {
          created_at: string
          deleted_at: string
          follower_id: string
          followed_id: string
          id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string
          follower_id: string
          followed_id: string
          id?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string
          follower_id?: string
          followed_id?: string
          id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
