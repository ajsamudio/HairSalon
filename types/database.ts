export type ServiceCategory =
  | "cuts"
  | "color"
  | "treatments"
  | "styling"
  | "extensions"
  | "add-ons";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category: ServiceCategory;
          duration_min: number;
          price_cents: number;
          deposit_cents: number;
          requires_consult: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          category: ServiceCategory;
          duration_min: number;
          price_cents: number;
          deposit_cents?: number;
          requires_consult?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          category?: ServiceCategory;
          duration_min?: number;
          price_cents?: number;
          deposit_cents?: number;
          requires_consult?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      availability_rules: {
        Row: {
          id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      availability_overrides: {
        Row: {
          id: string;
          date: string;
          start_time: string | null;
          end_time: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          start_time?: string | null;
          end_time?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          start_time?: string | null;
          end_time?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      bookings: {
        Row: {
          id: string;
          service_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          starts_at: string;
          ends_at: string;
          status: BookingStatus;
          stripe_session_id: string | null;
          stripe_payment_intent: string | null;
          deposit_paid_cents: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          starts_at: string;
          ends_at: string;
          status?: BookingStatus;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          deposit_paid_cents?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          starts_at?: string;
          ends_at?: string;
          status?: BookingStatus;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          deposit_paid_cents?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
  };
};

// Convenience aliases used throughout the app
export type ServiceRow =
  Database["public"]["Tables"]["services"]["Row"];
export type AvailabilityRuleRow =
  Database["public"]["Tables"]["availability_rules"]["Row"];
export type AvailabilityOverrideRow =
  Database["public"]["Tables"]["availability_overrides"]["Row"];
export type BookingRow =
  Database["public"]["Tables"]["bookings"]["Row"];
