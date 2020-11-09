import { useSelector } from "react-redux";
import { AppState } from "../reducers";

export function useBackupAppState() {
  const state = useSelector((state: AppState) => state.auth);
}

// export function useGetExternalAppState() {
//     const state = useSelector((state: AppState) => state.auth);
//   }
