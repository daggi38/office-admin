// Hand-written row types mirroring supabase/migrations/20260817000000_office_admin_init.sql.
// Regenerate/replace with `supabase gen types typescript` once the project is linked via the CLI.

export type EmploymentStatus = "active" | "inactive";
export type DocumentSource = "generated" | "uploaded";
export type DocumentLanguage = "en" | "am";

export type Employee = {
  id: string;
  name: string;
  role: string;
  start_date: string;
  employment_status: EmploymentStatus;
  salary: number | null;
  created_at: string;
  updated_at: string;
};

export type EmployeeInsert = Pick<Employee, "name" | "role" | "start_date"> &
  Partial<Pick<Employee, "employment_status" | "salary">>;

export type EmployeeUpdate = Partial<
  Pick<Employee, "name" | "role" | "start_date" | "employment_status" | "salary">
>;

export type DocumentCategory = {
  id: string;
  key: string;
  label_en: string;
  label_am: string;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: string;
  title: string;
  category_id: string;
  source: DocumentSource;
  language: DocumentLanguage | null;
  storage_path: string | null;
  mime_type: string | null;
  related_employee_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type DocumentInsert = Pick<Document, "title" | "category_id" | "source"> &
  Partial<
    Pick<
      Document,
      "language" | "storage_path" | "mime_type" | "related_employee_id" | "metadata"
    >
  >;

export type LeaveEntry = {
  id: string;
  employee_id: string;
  type: string;
  start_date: string;
  end_date: string | null;
  days: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type LeaveEntryInsert = Pick<LeaveEntry, "employee_id" | "type" | "start_date"> &
  Partial<Pick<LeaveEntry, "end_date" | "days" | "note">>;

export type ResourceSchedule = {
  id: string;
  resource: string;
  cycle_label: string | null;
  detail_en: string | null;
  detail_am: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ResourceScheduleUpsert = Pick<ResourceSchedule, "resource"> &
  Partial<Pick<ResourceSchedule, "id" | "cycle_label" | "detail_en" | "detail_am" | "sort_order">>;

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: Employee;
        Insert: EmployeeInsert;
        Update: EmployeeUpdate;
        Relationships: [];
      };
      document_categories: {
        Row: DocumentCategory;
        Insert: Partial<DocumentCategory> & Pick<DocumentCategory, "key" | "label_en" | "label_am">;
        Update: Partial<DocumentCategory>;
        Relationships: [];
      };
      documents: {
        Row: Document;
        Insert: DocumentInsert;
        Update: Partial<DocumentInsert>;
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "document_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_related_employee_id_fkey";
            columns: ["related_employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
      };
      leave_entries: {
        Row: LeaveEntry;
        Insert: LeaveEntryInsert;
        Update: Partial<LeaveEntryInsert>;
        Relationships: [
          {
            foreignKeyName: "leave_entries_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
      };
      resource_schedule: {
        Row: ResourceSchedule;
        Insert: ResourceScheduleUpsert;
        Update: Partial<ResourceScheduleUpsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
