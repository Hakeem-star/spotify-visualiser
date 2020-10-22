import { SIGN_IN, SIGN_OUT } from "../actions/types";

const INITIAL_STATE = {
  isSignedIn: null,
  userData: null,
};

interface userData {
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
export default (
  state = INITIAL_STATE,
  action: { type: string; payload: userData }
): { isSignedIn: boolean | null; userData: userData | null } => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, userData: action.payload };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, userData: null };
    default:
      return state;
  }
};
