export type Database = {
  public: {
    Tables: {
      ads: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          link_url: string | null
          status: string | null
          budget: number | null
          start_date: string | null
          end_date: string | null
          target_audience: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          status?: string | null
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          target_audience?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          status?: string | null
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          target_audience?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
