"use client";

import { useState, useEffect } from "react";

export interface UserProfile {
  _id: string;
  name: string;
  headline: string;
  description: string;
  location?: string;
  whatsapp?: string | null;
  cvUrl: string;
  image: { public_id: string; url: string };
  socials: {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    fiverr?: string | null;
    upwork?: string | null;
    gmail?: string | null;
  };
}

// Module-level cache — Hero and Footer share one fetch, no double request
let _cache: UserProfile | null = null;
let _promise: Promise<void> | null = null;

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(_cache);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) {
      setUser(_cache);
      setLoading(false);
      return;
    }

    if (!_promise) {
      _promise = fetch("/api/admin/user")
        .then((r) => r.json())
        .then((json) => {
          if (json.data) _cache = json.data;
        })
        .catch(console.error);
    }

    _promise.then(() => {
      setUser(_cache);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
