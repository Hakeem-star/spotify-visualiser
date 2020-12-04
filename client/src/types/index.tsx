import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { AppActions, GUEST } from "../actions/types";

export interface userData {
  country: string;
  display_name: string;
  email: string;
  explicit_content: { filter_enabled: boolean; filter_locked: boolean };
  external_urls: { spotify: string };
  followers: { href: null | string; total: number };
  href: string;
  id: string;
  images: string[];
  product: string;
  type: string;
  uri: string;
}
interface songSearchError {
  error?: {
    status: number;
    message: string;
  };
}
export interface youtubeResult {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      liveBroadcastContent: string;
      publishTime: string;
    };
  }[];
}
export interface spotifyResult {
  href: string;
  items: {
    album: {
      album_type: string;
      artists: [
        {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }
      ];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: false;
    name: string;
    popularity: number;
    preview_url: null | string;
    track_number: number;
    type: string;
    uri: string;
  }[];
  limit: number;
  next: string;
  offset: number;
  previous: null | string;
  total: number;
}

export type playSongPayload = {
  id: string;
  type?: string;
  details: {
    imageUrl: string;
    name: string;
    artist: string;
    year: string;
    url: string;
  };
} | null;

export interface remappedSearchResult extends songSearchError {
  // arrayOfResults: Record<string, any>;
  next: string;
  previous: string | null;
  items: {
    source: string;
    imageUrl: Record<
      number,
      {
        height: number;
        url: string;
        width: number;
      }
    >;
    name: string;
    artist: string;
    year: string;
    url: string;
    duration: string;
  }[];
}

export interface songSearchResult {
  SPOTIFY: remappedSearchResult | null;
  YOUTUBE: remappedSearchResult | null;
}
export interface spotifyAuthState {
  isSignedIn: boolean | null;
  userData: userData | null;
  spotifyToken: string | null;
}

export interface appAuthState {
  isSignedIn: boolean | null;
  userData: { displayName: string | typeof GUEST; email: string } | null;
}
export interface authFormErrorState {
  error: null | string;
  count: number;
}

export interface noTokenError {
  error: {
    status: 401;
    message: "The access token expired";
  };
}

export type updateSongSourcesType = string[];

export type ThunkResult<R> = ThunkAction<R, AppState, unknown, AppActions>;
