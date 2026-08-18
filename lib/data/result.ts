// Shared result shape for the data-access layer. Every function here returns
// this instead of throwing, so UI components can branch on `.error` without
// try/catch.
export type Result<T> = { data: T; error: null } | { data: null; error: string };

export function ok<T>(data: T): Result<T> {
  return { data, error: null };
}

export function err<T>(message: string): Result<T> {
  return { data: null, error: message };
}
