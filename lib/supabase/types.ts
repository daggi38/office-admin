// Hand-written row types mirroring supabase/migrations/20260817000000_office_admin_init.sql
// and 20260819000000_employee_master_data.sql.
// Regenerate/replace with `supabase gen types typescript` once the project is linked via the CLI.

export type EmploymentStatus = "active" | "inactive";
export type EmploymentType = "full_time" | "part_time" | "temporary" | "contract";
export type DocumentSource = "generated" | "uploaded";
export type DocumentLanguage = "en" | "am";

export type Employee = {
  id: string;
  // Core identity
  name: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  national_id: string | null;
  // Contact
  residential_address: string | null;
  personal_phone: string | null;
  personal_email: string | null;
  emergency_contact_primary_name: string | null;
  emergency_contact_primary_phone: string | null;
  emergency_contact_primary_relation: string | null;
  emergency_contact_secondary_name: string | null;
  emergency_contact_secondary_phone: string | null;
  emergency_contact_secondary_relation: string | null;
  // Employment & role
  role: string;
  work_location: string | null;
  employment_type: EmploymentType | null;
  department: string | null;
  supervisor_name: string | null;
  start_date: string;
  employment_status: EmploymentStatus;
  // Compensation & payroll (manual entry, never auto-calculated)
  salary: number | null;
  allowances: number | null;
  pension_contribution: number | null;
  loan_deduction: number | null;
  provident_fund: number | null;
  bank_name: string | null;
  bank_account_number: string | null;
  // Lifecycle & milestones
  hire_date: string | null;
  next_review_date: string | null;
  pto_balance: number | null;
  termination_date: string | null;
  termination_reason: string | null;
  benefits_end_date: string | null;
  created_at: string;
  updated_at: string;
};

type EmployeeOptionalField =
  | "first_name"
  | "middle_name"
  | "last_name"
  | "national_id"
  | "residential_address"
  | "personal_phone"
  | "personal_email"
  | "emergency_contact_primary_name"
  | "emergency_contact_primary_phone"
  | "emergency_contact_primary_relation"
  | "emergency_contact_secondary_name"
  | "emergency_contact_secondary_phone"
  | "emergency_contact_secondary_relation"
  | "work_location"
  | "employment_type"
  | "department"
  | "supervisor_name"
  | "employment_status"
  | "salary"
  | "allowances"
  | "pension_contribution"
  | "loan_deduction"
  | "provident_fund"
  | "bank_name"
  | "bank_account_number"
  | "hire_date"
  | "next_review_date"
  | "pto_balance"
  | "termination_date"
  | "termination_reason"
  | "benefits_end_date";

export type EmployeeInsert = Pick<Employee, "name" | "role" | "start_date"> &
  Partial<Pick<Employee, EmployeeOptionalField>>;

export type EmployeeUpdate = Partial<
  Pick<Employee, "name" | "role" | "start_date" | EmployeeOptionalField>
>;

export type TrainingRecord = {
  id: string;
  employee_id: string;
  training_name: string;
  completed_date: string | null;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TrainingRecordInsert = Pick<TrainingRecord, "employee_id" | "training_name"> &
  Partial<Pick<TrainingRecord, "completed_date" | "expiration_date">>;

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
      employee_training_records: {
        Row: TrainingRecord;
        Insert: TrainingRecordInsert;
        Update: Partial<TrainingRecordInsert>;
        Relationships: [
          {
            foreignKeyName: "employee_training_records_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
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
