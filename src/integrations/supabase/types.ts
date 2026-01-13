export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      anomalies: {
        Row: {
          anomaly_type: Database["public"]["Enums"]["anomaly_type"]
          attendance_log_ids: string[] | null
          created_at: string | null
          description: string
          id: string
          is_resolved: boolean | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["anomaly_severity"]
          title: string
          worker_ids: string[]
          zone: string | null
        }
        Insert: {
          anomaly_type: Database["public"]["Enums"]["anomaly_type"]
          attendance_log_ids?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          is_resolved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["anomaly_severity"]
          title: string
          worker_ids: string[]
          zone?: string | null
        }
        Update: {
          anomaly_type?: Database["public"]["Enums"]["anomaly_type"]
          attendance_log_ids?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          is_resolved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["anomaly_severity"]
          title?: string
          worker_ids?: string[]
          zone?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in: string
          created_at: string
          date: string
          employee_id: string
          id: number
        }
        Insert: {
          check_in?: string
          created_at?: string
          date?: string
          employee_id: string
          id?: number
        }
        Update: {
          check_in?: string
          created_at?: string
          date?: string
          employee_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_logs: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          created_at: string | null
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          verification_method: string | null
          worker_id: string
          zone: string | null
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          verification_method?: string | null
          worker_id: string
          zone?: string | null
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          verification_method?: string | null
          worker_id?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_logs_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      device_fingerprints: {
        Row: {
          browser_info: string | null
          fingerprint: string
          first_seen_at: string | null
          flagged: boolean | null
          id: string
          last_seen_at: string | null
          os_version: string | null
          screen_resolution: string | null
          total_workers_count: number | null
        }
        Insert: {
          browser_info?: string | null
          fingerprint: string
          first_seen_at?: string | null
          flagged?: boolean | null
          id?: string
          last_seen_at?: string | null
          os_version?: string | null
          screen_resolution?: string | null
          total_workers_count?: number | null
        }
        Update: {
          browser_info?: string | null
          fingerprint?: string
          first_seen_at?: string | null
          flagged?: boolean | null
          id?: string
          last_seen_at?: string | null
          os_version?: string | null
          screen_resolution?: string | null
          total_workers_count?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          avatar: string | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          joining_date: string
          name: string | null
          password: string
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string
          zone: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id: string
          joining_date?: string
          name?: string | null
          password?: string
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
          zone?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          joining_date?: string
          name?: string | null
          password?: string
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      payroll: {
        Row: {
          created_at: string
          employee_id: string
          month: string
          present_days: number
          salary: number
        }
        Insert: {
          created_at?: string
          employee_id: string
          month: string
          present_days?: number
          salary?: number
        }
        Update: {
          created_at?: string
          employee_id?: string
          month?: string
          present_days?: number
          salary?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          category: string
          created_at: string
          description: string
          employee_id: string
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          employee_id: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          employee_id?: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      worker_locations: {
        Row: {
          accuracy: number | null
          id: string
          latitude: number
          longitude: number
          recorded_at: string | null
          worker_id: string
          zone: string | null
        }
        Insert: {
          accuracy?: number | null
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string | null
          worker_id: string
          zone?: string | null
        }
        Update: {
          accuracy?: number | null
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string | null
          worker_id?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_locations_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          created_at: string | null
          department: string | null
          employee_id: string
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string | null
          zone: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          employee_id: string
          full_name: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
          zone: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          employee_id?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
          zone?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_attendance: { Args: { p_employee_id: string }; Returns: undefined }
    }
    Enums: {
      anomaly_severity: "low" | "medium" | "high" | "critical"
      anomaly_type: "buddy_punching" | "shared_device" | "impossible_travel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      anomaly_severity: ["low", "medium", "high", "critical"],
      anomaly_type: ["buddy_punching", "shared_device", "impossible_travel"],
    },
  },
} as const
