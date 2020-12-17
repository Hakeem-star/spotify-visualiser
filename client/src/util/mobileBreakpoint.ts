import { useBreakpointValue } from "@chakra-ui/react";

export const useMobileBreakpoint = (): boolean | undefined => {
  return useBreakpointValue({ base: true, md: false });
};
