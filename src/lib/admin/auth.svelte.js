// Supabase email/password session for the admin. The public site never imports
// this module; the admin is lazy-loaded and only touches it after `#/admin`.
import { supabase, supabaseConfigured } from "../supabaseClient.js";

let session = $state(null);
let ready = $state(!supabaseConfigured);
let busy = $state(false);
let error = $state("");

export const auth = {
  get session() {
    return session;
  },
  get user() {
    return session?.user ?? null;
  },
  get ready() {
    return ready;
  },
  get busy() {
    return busy;
  },
  get error() {
    return error;
  },
  get configured() {
    return supabaseConfigured;
  },
};

let started = false;

// Call once from AdminApp. Safe to call again.
export function initAuth() {
  if (started || !supabase) return;
  started = true;

  supabase.auth
    .getSession()
    .then(({ data }) => {
      session = data.session ?? null;
    })
    .catch((cause) => {
      error = cause?.message ?? String(cause);
    })
    .finally(() => {
      ready = true;
    });

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    session = nextSession ?? null;
    ready = true;
  });
}

export async function signIn(email, password) {
  if (!supabase) {
    error = "Supabase is not configured.";
    return false;
  }
  busy = true;
  error = "";
  try {
    const { data, error: cause } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (cause) {
      error = cause.message;
      return false;
    }
    session = data.session ?? null;
    return true;
  } catch (cause) {
    error = cause?.message ?? String(cause);
    return false;
  } finally {
    busy = false;
  }
}

export async function signOut() {
  if (!supabase) return;
  busy = true;
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignore network/session errors: the local session is cleared either way,
    // otherwise a dead token would leave the admin stuck on the editor.
  } finally {
    session = null;
    busy = false;
  }
}

export function clearAuthError() {
  error = "";
}
