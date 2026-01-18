export type ShortUrl = {
  id: string;
  user_id: string;
  original_url: string;
  short_code: string;
  custom_slug: string | null;
  created_at: string;
  expires_at: string | null;
  is_permanent: boolean;
  click_count: number;
};

export type UrlClick = {
  id: string;
  short_url_id: string;
  clicked_at: string;
  referrer: string | null;
  user_agent: string | null;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};
